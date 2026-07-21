import { AppError, ErrorCode, ErrorKind } from "../types/AppError";

export class ErrorMapper {
  public static map(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      const isAxiosError = "isAxiosError" in error || (error as any).config !== undefined;
      if (isAxiosError) {
        return this.mapAxiosError(error as any);
      }

      if ("issues" in error && Array.isArray((error as any).issues)) {
        return this.mapZodError(error as any);
      }

      if (error instanceof TypeError) {
        return new AppError(
          `Type Error: ${error.message}`,
          ErrorCode.UNKNOWN,
          ErrorKind.FATAL,
          { name: error.name },
          error
        );
      }

      if (error instanceof ReferenceError) {
        return new AppError(
          `Reference Error: ${error.message}`,
          ErrorCode.UNKNOWN,
          ErrorKind.FATAL,
          { name: error.name },
          error
        );
      }

      return new AppError(
        error.message,
        ErrorCode.UNKNOWN,
        ErrorKind.RECOVERABLE,
        { name: error.name },
        error
      );
    }

    return new AppError(
      typeof error === "string" ? error : "An unexpected failure occurred.",
      ErrorCode.UNKNOWN,
      ErrorKind.RECOVERABLE,
      { raw: error }
    );
  }

  private static mapAxiosError(axiosError: any): AppError {
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const url = axiosError.config?.url;

    let code = ErrorCode.SERVER_ERROR;
    let kind = ErrorKind.RECOVERABLE;

    if (!axiosError.response) {
      return new AppError(
        "Network connection lost. Please verify your connection status.",
        ErrorCode.NETWORK_ERROR,
        ErrorKind.EPHEMERAL,
        { url },
        axiosError
      );
    }

    switch (status) {
      case 401:
        code = ErrorCode.UNAUTHORIZED;
        kind = ErrorKind.FATAL;
        break;
      case 403:
        code = ErrorCode.FORBIDDEN;
        kind = ErrorKind.FATAL;
        break;
      case 404:
        code = ErrorCode.NOT_FOUND;
        kind = ErrorKind.RECOVERABLE;
        break;
      case 422:
        code = ErrorCode.VALIDATION_ERROR;
        kind = ErrorKind.EPHEMERAL;
        break;
      default:
        if (status >= 500) {
          code = ErrorCode.SERVER_ERROR;
          kind = ErrorKind.RECOVERABLE;
        }
    }

    return new AppError(
      data?.message || axiosError.message || "Network exchange failed.",
      code,
      kind,
      { status, url, serverResponse: data },
      axiosError
    );
  }

  private static mapZodError(zodError: any): AppError {
    const contextMap: Record<string, string> = {};
    zodError.issues.forEach((issue: any) => {
      const path = issue.path.join(".");
      contextMap[path] = issue.message;
    });

    return new AppError(
      "Data validation criteria not satisfied.",
      ErrorCode.VALIDATION_ERROR,
      ErrorKind.EPHEMERAL,
      { validationErrors: contextMap },
      zodError
    );
  }
}