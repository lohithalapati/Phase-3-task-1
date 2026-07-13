import { ApiError } from './ApiError';
import { ErrorCategory } from './errorCategories';
import { isAxiosError } from 'axios';

const statusCodeMap: Record<number, ErrorCategory> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'TOO_MANY_REQUESTS',
  500: 'SERVER_ERROR',
  501: 'SERVER_ERROR',
  502: 'SERVER_ERROR',
  503: 'SERVER_ERROR',
  504: 'SERVER_ERROR',
};

export function mapToApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    const correlationId = error.config?.headers?.['X-Correlation-ID'] as string | undefined;

    if (error.response) {
      const { status, data } = error.response;
      return new ApiError({
        message: data?.message || error.message || `HTTP error ${status}`,
        category: statusCodeMap[status] ?? 'UNKNOWN',
        code: data?.code ?? `HTTP_${status}`,
        details: data?.details,
        correlationId,
      });
    }

    // No response — network/timeout/cancel
    const msg: string = error.message ?? '';
    if (error.code === 'ECONNABORTED' || msg.includes('timeout')) {
      return new ApiError({
        message: 'The connection timed out while processing your request.',
        category: 'TIMEOUT_ERROR',
        code: 'CONNECTION_TIMEOUT',
        correlationId,
      });
    }
    if (error.code === 'ERR_CANCELED') {
      return new ApiError({
        message: 'The request was canceled.',
        category: 'CANCELED',
        code: 'REQUEST_CANCELED',
        correlationId,
      });
    }
    return new ApiError({
      message: msg || 'No response received. Please check your network connection.',
      category: 'NETWORK_ERROR',
      code: 'NETWORK_ERROR',
      correlationId,
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message, category: 'UNKNOWN', code: 'UNKNOWN_ERROR' });
  }

  if (typeof error === 'string') {
    return new ApiError({ message: error, category: 'UNKNOWN', code: 'UNKNOWN_ERROR' });
  }
  if (typeof error === 'number' || typeof error === 'boolean') {
    return new ApiError({ message: String(error), category: 'UNKNOWN', code: 'UNKNOWN_ERROR' });
  }
  if (typeof error === 'object' && error !== null) {
    try {
      return new ApiError({ message: JSON.stringify(error), category: 'UNKNOWN', code: 'UNKNOWN_ERROR' });
    } catch {
      // circular or non-serializable
    }
  }

  return new ApiError();
}
