import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ExtendedRequestConfig } from '../types/api';
import { apiConfig } from '../config/apiConfig';
import { logRefresh } from '../logging/requestLog';
import { apiMetrics } from '../metrics/metrics';

interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  config: ExtendedRequestConfig;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

function processQueue(error: Error | null, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token && prom.config.headers) {
      prom.config.headers['Authorization'] = `${apiConfig.security.authHeaderType} ${token}`;
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
}

export async function handleRefreshPipeline(
  clientInstance: AxiosInstance,
  failedConfig: ExtendedRequestConfig
): Promise<AxiosResponse> {
  if (failedConfig.skipRefresh) {
    throw new Error('Refresh skipped by request configuration');
  }

  if (isRefreshing) {
    logRefresh('QUEUE_REPLAY', `Queueing request for url: ${failedConfig.url}`);
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, config: failedConfig });
    })
      .then((updatedConfig) => clientInstance(updatedConfig as ExtendedRequestConfig))
      .catch((err) => Promise.reject(err));
  }

  isRefreshing = true;
  logRefresh('START');
  apiMetrics.incrementRefreshes();

  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  if (!refreshToken) {
    logRefresh('FAILURE', 'No refresh token available');
    triggerSessionReset();
    isRefreshing = false;
    throw new Error('No refresh token available');
  }

  try {
    const refreshUrl = `${apiConfig.baseUrl}/auth/refresh`;
    const response = await axios.post(refreshUrl, { refreshToken }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    if (!accessToken) {
      throw new Error('Token refresh payload missing expected token structure');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
    }

    logRefresh('SUCCESS', 'Access token updated successfully');
    processQueue(null, accessToken);
    isRefreshing = false;

    if (failedConfig.headers) {
      failedConfig.headers['Authorization'] = `${apiConfig.security.authHeaderType} ${accessToken}`;
    }
    return clientInstance(failedConfig);
  } catch (error) {
    logRefresh('FAILURE', 'Critical error during refresh pipeline execution');
    const cleanError = error instanceof Error ? error : new Error(String(error));
    processQueue(cleanError, null);
    triggerSessionReset();
    isRefreshing = false;
    throw error;
  }
}

function triggerSessionReset(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new CustomEvent(apiConfig.security.sessionResetEvent));
  }
}
