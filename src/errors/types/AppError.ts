export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
}

export enum ErrorKind {
  FATAL = "FATAL",
  RECOVERABLE = "RECOVERABLE",
  EPHEMERAL = "EPHEMERAL",
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly kind: ErrorKind;
  public readonly timestamp: number;
  public readonly context: Record<string, any>;
  public readonly originalError?: any;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN,
    kind: ErrorKind = ErrorKind.RECOVERABLE,
    context: Record<string, any> = {},
    originalError?: any
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.kind = kind;
    this.timestamp = Date.now();
    this.context = context;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}