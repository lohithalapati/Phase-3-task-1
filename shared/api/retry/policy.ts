import { ExtendedRequestConfig } from '../types/api';
import { isIdempotentRequest } from '../utils/isIdempotent';
import { apiConfig } from '../config/apiConfig';

export function shouldRetry(config: ExtendedRequestConfig, errorStatus?: number): boolean {
  if (config.skipRetry) return false;
  if (config.signal?.aborted) return false;

  const maxRetries = config.maxRetries ?? apiConfig.retryPolicy.maxRetries;
  const currentAttempt = config.retryCount ?? 0;
  if (currentAttempt >= maxRetries) return false;

  if (!isIdempotentRequest(config.method)) return false;

  if (errorStatus) {
    const noRetryStatuses = [400, 401, 403, 404, 422];
    if (noRetryStatuses.includes(errorStatus)) return false;
  }

  return true;
}
