import { AxiosResponse, AxiosInstance } from 'axios';
import { ExtendedRequestConfig } from '../types/api';
import { logResponse, logRetry } from '../logging/requestLog';
import { apiMetrics } from '../metrics/metrics';
import { mapToApiError } from '../errors/mapError';
import { shouldRetry } from '../retry/policy';
import { getJitterDelay } from '../retry/jitter';
import { handleRefreshPipeline } from './refresh';
import { apiConfig } from '../config/apiConfig';

export function responseSuccessInterceptor(response: AxiosResponse): AxiosResponse {
  const config = response.config as ExtendedRequestConfig;
  const duration = config.startTime ? Date.now() - config.startTime : 0;

  apiMetrics.trackLatency(duration);
  apiMetrics.incrementSuccesses();

  logResponse(config, response.status, response.data, duration);

  return response;
}

export async function responseErrorInterceptor(
  error: any,
  clientInstance: AxiosInstance
): Promise<any> {
  const config = error.config as ExtendedRequestConfig;

  if (!config) {
    apiMetrics.incrementFailures();
    return Promise.reject(mapToApiError(error));
  }

  const duration = config.startTime ? Date.now() - config.startTime : 0;
  apiMetrics.trackLatency(duration);

  const status = error.response?.status;

  if (status === 401 && !config.skipRefresh) {
    try {
      return await handleRefreshPipeline(clientInstance, config);
    } catch (refreshErr) {
      apiMetrics.incrementFailures();
      return Promise.reject(mapToApiError(refreshErr));
    }
  }

  if (shouldRetry(config, status)) {
    config.retryCount = (config.retryCount ?? 0) + 1;
    apiMetrics.incrementRetries();

    const delay = getJitterDelay(
      config.retryCount,
      apiConfig.retryPolicy.baseDelayMs,
      apiConfig.retryPolicy.maxDelayMs
    );

    logRetry(config, config.retryCount, error.message || 'Transient error', delay);

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (config.signal?.aborted) {
          reject(new DOMException('Aborted during retry delay', 'AbortError'));
        } else {
          resolve();
        }
      }, delay);

      if (config.signal) {
        config.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted during retry delay', 'AbortError'));
        });
      }
    });

    return clientInstance(config);
  }

  apiMetrics.incrementFailures();
  const mappedError = mapToApiError(error);
  return Promise.reject(mappedError);
}
