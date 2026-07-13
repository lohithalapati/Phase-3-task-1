import { ErrorCategory } from './errorCategories';

export interface ApiErrorPayload {
  message?: string;
  category?: ErrorCategory;
  code?: string;
  timestamp?: string;
  details?: Record<string, any>;
  correlationId?: string;
}

export class ApiError extends Error {
  public readonly category: ErrorCategory;
  public readonly code: string;
  public readonly timestamp: string;
  public readonly details?: Record<string, any>;
  public readonly correlationId?: string;

  constructor(payload: Partial<ApiErrorPayload> = {}) {
    super(payload.message ?? 'An unknown runtime error occurred.');
    this.name = 'ApiError';
    this.category = payload.category ?? 'UNKNOWN';
    this.code = payload.code ?? 'UNKNOWN_ERROR';
    this.timestamp = payload.timestamp ?? new Date().toISOString();
    this.details = payload.details;
    this.correlationId = payload.correlationId;
  }
}
