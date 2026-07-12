import { envConfig } from '../config/env.config';

export interface LogMetric {
  url: string;
  method: string;
  durationMs: number;
  status?: number;
}

class NetworkLogger {
  private formatLog(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string, context?: unknown): string {
    const timestamp = new Date().toISOString();
    const cleanCtx = context ? ` | Payload: ${JSON.stringify(context)}` : '';
    return `[NH-NET] [${timestamp}] [${level}] ${message}${cleanCtx}`;
  }

  public debug(message: string, context?: unknown): void {
    if (envConfig.getPolicy().loggingEnabled) {
      console.log(`%c${this.formatLog('DEBUG', message, context)}`, 'color: #9e9e9e');
    }
  }

  public info(message: string, context?: unknown): void {
    if (envConfig.getPolicy().loggingEnabled || !envConfig.isProduction()) {
      console.info(`%c${this.formatLog('INFO', message, context)}`, 'color: #03a9f4');
    }
  }

  public warn(message: string, context?: unknown): void {
    console.warn(`%c${this.formatLog('WARN', message, context)}`, 'color: #ff9800');
  }

  public error(message: string, error?: unknown): void {
    console.error(`%c${this.formatLog('ERROR', message)}`, 'color: #f44336', error);
  }

  public logMetric(metric: LogMetric): void {
    if (envConfig.getPolicy().collectMetrics) {
      const color = metric.status && metric.status < 400 ? '#4caf50' : '#f44336';
      console.log(
        `%c[NH-PERF] ${metric.method.toUpperCase()} ${metric.url} — ${metric.durationMs}ms — Status: ${metric.status || 'FAILED'}`,
        `color: ${color}; font-weight: bold;`
      );
    }
  }
}

export const logger = new NetworkLogger();