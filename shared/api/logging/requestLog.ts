import { ExtendedRequestConfig } from '../types/api';
import { apiLogger } from './logger';
import { sanitizePayload } from '../utils/sanitize';

export function logRequest(config: ExtendedRequestConfig): void {
  const sanitizedBody = sanitizePayload(config.data);
  apiLogger.debug(
    `--> ${config.method?.toUpperCase()} ${config.url} | CorrelationId: ${config.correlationId}`,
    {
      headers: sanitizePayload(config.headers),
      params: sanitizePayload(config.params),
      body: sanitizedBody,
    }
  );
}

export function logResponse(config: ExtendedRequestConfig, status: number, data: any, durationMs: number): void {
  apiLogger.debug(
    `<-- ${config.method?.toUpperCase()} ${config.url} | Status: ${status} | Duration: ${durationMs}ms | CorrelationId: ${config.correlationId}`,
    {
      payload: sanitizePayload(data),
    }
  );
}

export function logRetry(config: ExtendedRequestConfig, attempt: number, errorMsg: string, delayMs: number): void {
  apiLogger.warn(
    `[RETRY] Attempt ${attempt} for ${config.method?.toUpperCase()} ${config.url} due to error: "${errorMsg}". Retrying in ${delayMs}ms... | CorrelationId: ${config.correlationId}`
  );
}

export function logRefresh(event: 'START' | 'SUCCESS' | 'FAILURE' | 'QUEUE_REPLAY', details?: string): void {
  apiLogger.info(`[REFRESH_PIPELINE] Event: ${event} ${details ? `| Details: ${details}` : ''}`);
}
