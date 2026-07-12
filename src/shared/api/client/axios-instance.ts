import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { envConfig } from '../config/env.config';
import { ENDPOINT_REGISTRY } from '../config/endpoints';
import { logger } from '../utils/logger';
import { metricsCollector } from '../utils/metrics';
import { MockAdapter } from '../mocks/mock-adapter';
import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  ConflictError,
  TimeoutError,
  NetworkError,
  ServerError,
  UnknownError,
} from '../errors/api-errors';

interface CustomConfigExtensions {
  _retryCount?: number;
  _skipCancellation?: boolean;
}

declare module 'axios' {
  interface AxiosRequestConfig extends CustomConfigExtensions {}
  interface InternalAxiosRequestConfig extends CustomConfigExtensions {}
}

const activeRequests = new Map<string, AbortController>();

const generateRequestSignature = (config: AxiosRequestConfig): string => {
  const method = config.method?.toLowerCase() || '';
  const url = config.url || '';
  const params = typeof config.params === 'object' ? JSON.stringify(config.params) : '';
  const data = typeof config.data === 'object' ? JSON.stringify(config.data) : '';
  return `${method}:${url}:${params}:${data}`;
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: envConfig.getPolicy().baseUrl,
  timeout: envConfig.getPolicy().timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processFailedQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    metricsCollector.trackRequest();
    const policy = envConfig.getPolicy();
    const traceId = `trc_${Math.random().toString(36).substring(2, 10)}`;
    const correlationId = `corr_${Math.random().toString(36).substring(2, 10)}`;

    config.headers['x-trace-id'] = traceId;
    config.headers['x-correlation-id'] = correlationId;
    config.headers['x-request-timestamp'] = new Date().toISOString();

    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (!config._skipCancellation) {
      const signature = generateRequestSignature(config);
      if (activeRequests.has(signature)) {
        const controller = activeRequests.get(signature);
        controller?.abort();
        activeRequests.delete(signature);
        logger.debug(`Cancelled matching duplicated signature: [${signature}]`);
      }
      const controller = new AbortController();
      config.signal = controller.signal;
      activeRequests.set(signature, controller);
    }

    if (policy.mockEnabled && MockAdapter.isMockable(config.url || '')) {
      logger.debug(`Mock active. Intercepting: ${config.url}`);
      try {
        const mockResponse = await MockAdapter.executeMockRequest(
          config.url || '',
          config.method || 'get',
          config.data
        );
        return Promise.reject({
          config,
          response: {
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            data: mockResponse,
          },
          isMock: true,
        });
      } catch (err: unknown) {
        return Promise.reject(err);
      }
    }

    return config;
  },
  (error: AxiosError) => {
    metricsCollector.trackFailure();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config } = response;
    const signature = generateRequestSignature(config);
    activeRequests.delete(signature);

    const startTimeStr = config.headers['x-request-timestamp'] as string;
    let durationMs = 0;
    if (startTimeStr) {
      durationMs = Date.now() - new Date(startTimeStr).getTime();
      logger.logMetric({
        url: config.url || '',
        method: config.method || 'get',
        durationMs,
        status: response.status,
      });
      if (response.data && typeof response.data === 'object' && 'meta' in response.data) {
        (response.data as { meta: { durationMs: number } }).meta.durationMs = durationMs;
      }
    }

    metricsCollector.trackSuccess(durationMs);
    return response;
  },
  async (error: unknown) => {
    const mockError = error as { isMock?: boolean; response: AxiosResponse; config: InternalAxiosRequestConfig } | null | undefined;
    if (mockError && mockError.isMock) {
      const startTimeStr = mockError.config.headers['x-request-timestamp'] as string;
      const durationMs = startTimeStr ? Date.now() - new Date(startTimeStr).getTime() : 0;
      metricsCollector.trackSuccess(durationMs);
      return mockError.response;
    }

    if (axios.isCancel(error)) {
      logger.debug(`Request gracefully cancelled.`);
      metricsCollector.trackFailure();
      return Promise.reject(error);
    }

    const axiosError = error as AxiosError;
    const { config, response } = axiosError;

    if (config) {
      const signature = generateRequestSignature(config);
      activeRequests.delete(signature);
    }

    if (response) {
      const startTimeStr = config?.headers['x-request-timestamp'] as string;
      if (startTimeStr) {
        logger.logMetric({
          url: config?.url || '',
          method: config?.method || 'get',
          durationMs: Date.now() - new Date(startTimeStr).getTime(),
          status: response.status,
        });
      }

      // Check for Allowed Retry Status Codes (ONLY 5xx transient server warnings)
      const allowedRetryStatuses = [500, 502, 503, 504];
      const isTransientError = allowedRetryStatuses.includes(response.status);

      // Silent Concurrent Auth Lease Refresh Queue Flow
      if (response.status === 401 && config && config.url !== ENDPOINT_REGISTRY.auth.refresh) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                config.headers.Authorization = `Bearer ${token}`;
                resolve(axiosInstance(config));
              },
              reject: (err: unknown) => reject(err),
            });
          });
        }

        isRefreshing = true;
        metricsCollector.trackRefresh();
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            logger.info('Access token expired. Re-authenticating session via Refresh flow.');
            const refreshResponse = await axiosInstance.post<{ accessToken: string; refreshToken: string }>(
              ENDPOINT_REGISTRY.auth.refresh,
              { refreshToken },
              { _skipCancellation: true } as AxiosRequestConfig
            );

            const { accessToken: newAccess, refreshToken: newRefresh } = refreshResponse.data;
            localStorage.setItem('access_token', newAccess);
            localStorage.setItem('refresh_token', newRefresh);

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
            config.headers.Authorization = `Bearer ${newAccess}`;

            processFailedQueue(null, newAccess);
            isRefreshing = false;

            return axiosInstance(config);
          } catch (refreshErr) {
            processFailedQueue(refreshErr, null);
            isRefreshing = false;
            logger.error('Session authentication lease expired. Dispatching logout operations.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.dispatchEvent(new Event('auth:unauthorized'));
            metricsCollector.trackFailure();
            return Promise.reject(new AuthenticationError('Lease validation expired. Redirecting to credentials portal.'));
          }
        }
      }

      // Explicit Retry Strategy execution (No retries on 400/401 validation or authentication errors)
      const retryPolicy = envConfig.getPolicy();
      if (config && isTransientError) {
        config._retryCount = config._retryCount ?? 0;
        if (config._retryCount < retryPolicy.retryLimit) {
          config._retryCount++;
          metricsCollector.trackRetry();
          const delay = config._retryCount * retryPolicy.retryDelayFactor;
          logger.warn(`Server side warning: ${response.status}. Initiating retry schedule: Attempt ${config._retryCount} in ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return axiosInstance(config);
        }
      }
    }

    metricsCollector.trackFailure();
    const transformedError = transformAxiosError(axiosError);
    logger.error(`Resolved Domain Error Execution Path: ${transformedError.message}`, transformedError);
    return Promise.reject(transformedError);
  }
);

export function transformAxiosError(error: AxiosError): ApiError {
  const url = error.config?.url;
  const status = error.response?.status;
  const statusText = error.response?.statusText;
  const headers = error.response?.headers as Record<string, string> | undefined;
  
  const traceId = headers?.['x-trace-id'] || '';
  const correlationId = headers?.['x-correlation-id'] || '';

  const responseData = error.response?.data as { error?: { message?: string; validationErrors?: Record<string, string[]> } } | undefined;
  const serverMessage = responseData?.error?.message;
  const validationErrors = responseData?.error?.validationErrors;

  const context = {
    status,
    statusText,
    url,
    traceId,
    correlationId,
    validationErrors,
    rawError: error,
  };

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return new TimeoutError('The networking transaction timed out during transmission.', context);
  }

  if (!error.response) {
    return new NetworkError('A localized network loss or connectivity block was identified.', context);
  }

  const msg = serverMessage || error.message || 'An unrecognized server side event occurred.';

  switch (status) {
    case 400:
      if (validationErrors) {
        return new ValidationError(msg, context);
      }
      return new ApiError(msg, context);
    case 401:
      return new AuthenticationError(msg, context);
    case 403:
      return new AuthorizationError(msg, context);
    case 409:
      return new ConflictError(msg, context);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(msg, context);
    default:
      return new UnknownError(msg, context);
  }
}