export interface ILogger {
  info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, context?: any): void;
}

class SystemLogger implements ILogger {
  info(message: string, context?: any): void {
    // Structured console tracking
    console.info(message, context);
  }
  warn(message: string, context?: any): void {
    // Structured warning warnings
    console.warn(message, context);
  }
  error(message: string, context?: any): void {
    // Structured error capturing
    console.error(message, context);
  }
}

export const Logger = new SystemLogger();
