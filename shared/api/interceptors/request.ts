import { ExtendedRequestConfig } from '../types/api';
import { HEADER_CORRELATION_ID, HEADER_CLIENT_VERSION } from '../constants/headers';
import { generateCorrelationId } from '../utils/correlationId';
import { apiConfig } from '../config/apiConfig';
import { logRequest } from '../logging/requestLog';
import { apiMetrics } from '../metrics/metrics';

export function requestInterceptor(config: ExtendedRequestConfig): ExtendedRequestConfig {
  config.startTime = Date.now();

  const correlationId = generateCorrelationId();
  config.correlationId = correlationId;

  config.headers = config.headers || {};
  config.headers[HEADER_CORRELATION_ID] = correlationId;
  config.headers[HEADER_CLIENT_VERSION] = apiConfig.version;

  if (!config.skipAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers['Authorization'] = `${apiConfig.security.authHeaderType} ${token}`;
    }
  }

  apiMetrics.incrementRequests();
  logRequest(config);

  return config;
}
