export interface ILogger {
  debug(msg: string, ...args: any[]): void;
  info(msg: string, ...args: any[]): void;
  warn(msg: string, ...args: any[]): void;
  error(msg: string, ...args: any[]): void;
}

class CentralLogger implements ILogger {
  private isDev = true;

  public debug(msg: string, ...args: any[]): void {
    if (this.isDev) {
      console.debug(`[API DEBUG] [${new Date().toISOString()}] ${msg}`, ...args);
    }
  }

  public info(msg: string, ...args: any[]): void {
    console.info(`[API INFO] [${new Date().toISOString()}] ${msg}`, ...args);
  }

  public warn(msg: string, ...args: any[]): void {
    console.warn(`[API WARN] [${new Date().toISOString()}] ${msg}`, ...args);
  }

  public error(msg: string, ...args: any[]): void {
    console.error(`[API ERROR] [${new Date().toISOString()}] ${msg}`, ...args);
  }
}

export const apiLogger: ILogger = new CentralLogger();
