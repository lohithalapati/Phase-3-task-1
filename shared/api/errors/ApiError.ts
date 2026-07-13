import { ErrorCategory, ApiErrorPayload } from '../types/errors';

export class ApiError extends Error {
  public readonly category: ErrorCategory;
  public readonly status?: number;
  public readonly code?: string;
  public readonly correlationId?: string;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.category = payload.category;
    this.status = payload.status;
    this.code = payload.code;
    this.correlationId = payload.correlationId;
    this.details = payload.details;
    this.timestamp = payload.timestamp;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  public toJSON(): ApiErrorPayload {
    return {
      message: this.message,
      category: this.category,
      status: this.status,
      code: this.code,
      correlationId: this.correlationId,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}
