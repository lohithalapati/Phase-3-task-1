import { AxiosError } from 'axios';
import { ApiError } from './ApiError';
import { ErrorCategory } from '../types/errors';
import { HEADER_CORRELATION_ID } from '../constants/headers';

export function mapToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  const timestamp = new Date().toISOString();

  if (error && typeof error === 'object' && (error as any).isAxiosError) {
    const axiosError = error as AxiosError<any>;
    const correlationId = (axiosError.config?.headers?.[HEADER_CORRELATION_ID] as string) || 'N/A';

    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return new ApiError({
          message: 'The connection timed out while processing your request.',
          category: 'TIMEOUT_ERROR',
          status: 408,
          code: 'REQUEST_TIMEOUT',
          correlationId,
          timestamp,
        });
      }
      if (axiosError.code === 'ERR_CANCELED') {
        return new ApiError({
          message: 'The request was canceled.',
          category: 'CANCELED',
          code: 'REQUEST_CANCELED',
          correlationId,
          timestamp,
        });
      }
      return new ApiError({
        message: 'No response received. Please check your network connection.',
        category: 'NETWORK_ERROR',
        code: 'NETWORK_UNREACHABLE',
        correlationId,
        timestamp,
      });
    }

    const status = axiosError.response.status;
    const responseData = axiosError.response.data || {};
    const message = responseData.message || axiosError.message || 'An error occurred';
    const code = responseData.code || `HTTP_${status}`;
    const details = responseData.details || undefined;

    let category: ErrorCategory = 'UNKNOWN';

    if (status === 400) category = 'BAD_REQUEST';
    else if (status === 401) category = 'UNAUTHORIZED';
    else if (status === 403) category = 'FORBIDDEN';
    else if (status === 404) category = 'NOT_FOUND';
    else if (status === 422) category = 'VALIDATION_ERROR';
    else if (status >= 500) category = 'SERVER_ERROR';

    return new ApiError({
      message,
      category,
      status,
      code,
      correlationId,
      details,
      timestamp,
    });
  }

  const baseError = error as Error;
  return new ApiError({
    message: baseError?.message || 'An unknown runtime error occurred.',
    category: 'UNKNOWN',
    code: 'UNKNOWN_ERROR',
    timestamp,
  });
}
