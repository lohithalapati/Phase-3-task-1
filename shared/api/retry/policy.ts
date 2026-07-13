import { ExtendedRequestConfig } from '../types/api';
import { isIdempotentRequest } from '../utils/isIdempotent';

const NON_RETRYABLE = new Set([400, 401, 403, 404, 409, 422, 429]);

export function shouldRetry(config: ExtendedRequestConfig, status?: number): boolean {
  if (config.skipRetry) return false;
  if (config.signal?.aborted) return false;

  const count = config.retryCount ?? 0;
  const max   = config.maxRetries ?? 3;
  if (count >= max) return false;

  if (!isIdempotentRequest(config.method)) return false;

  if (status !== undefined && status !== null) {
    if (status >= 500 && status < 600) return true;
    return false; // 4xx non-retryable, 3xx non-retryable
  }

  // No status = network error = retryable
  return true;
}
