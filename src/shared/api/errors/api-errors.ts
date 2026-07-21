export class BaseError extends Error {
  public readonly timestamp: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ApiErrorContext {
  status?: number;
  statusText?: string;
  url?: string;
  traceId?: string;
  correlationId?: string;
  validationErrors?: Record<string, string[]>;
  rawError?: unknown;
}

export class ApiError extends BaseError {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly url?: string;
  public readonly traceId?: string;
  public readonly correlationId?: string;
  public readonly validationErrors?: Record<string, string[]>;

  constructor(message: string, context?: ApiErrorContext) {
    super(message);
    this.status = context?.status;
    this.statusText = context?.statusText;
    this.url = context?.url;
    this.traceId = context?.traceId;
    this.correlationId = context?.correlationId;
    this.validationErrors = context?.validationErrors;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Session expired or unauthenticated. Please re-authenticate.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Insufficient permissions to perform this action.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed for request inputs.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict detected with current state of resource.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'The execution request timed out before completion.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network connection interrupted or hostname unreachable.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class ServerError extends ApiError {
  constructor(message = 'An unexpected internal processing server error occurred.', context?: ApiErrorContext) {
    super(message, context);
  }
}

export class UnknownError extends ApiError {
  constructor(message = 'An unmapped, unresolved exception occurred.', context?: ApiErrorContext) {
    super(message, context);
  }
}