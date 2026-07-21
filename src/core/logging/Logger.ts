export interface ILogger {
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
}

class SystemLogger implements ILogger {
  private static instance: SystemLogger;
  private adapters: Set<ILogger> = new Set();

  private constructor() {}

  public static getInstance(): SystemLogger {
    if (!SystemLogger.instance) {
      SystemLogger.instance = new SystemLogger();
    }
    return SystemLogger.instance;
  }

  public registerAdapter(adapter: ILogger): void {
    this.adapters.add(adapter);
  }

  public removeAdapter(adapter: ILogger): void {
    this.adapters.delete(adapter);
  }

  public info(message: string, context?: Record<string, any>): void {
    console.info(`[INFO] ${message}`, context || "");
    this.adapters.forEach((a) => {
      try { a.info(message, context); } catch (e) { /* ignore adapter failures */ }
    });
  }

  public warn(message: string, context?: Record<string, any>): void {
    console.warn(`[WARN] ${message}`, context || "");
    this.adapters.forEach((a) => {
      try { a.warn(message, context); } catch (e) {}
    });
  }

  public error(message: string, context?: Record<string, any>): void {
    console.error(`[ERROR] ${message}`, context || "");
    this.adapters.forEach((a) => {
      try { a.error(message, context); } catch (e) {}
    });
  }

  public debug(message: string, context?: Record<string, any>): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${message}`, context || "");
    }
    this.adapters.forEach((a) => {
      try { a.debug(message, context); } catch (e) {}
    });
  }
}

export const Logger = SystemLogger.getInstance();