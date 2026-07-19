Write-Host "Setting up structured logging..." -ForegroundColor Cyan

$loggerCode = @"
// src/logging/Logger.ts

import { createLogger, format, transports, Logger } from 'winston';

const { combine, timestamp, errors, json, colorize, simple } = format;

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  service?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

export class AppLogger {
  private readonly logger: Logger;
  private readonly context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(timestamp(), errors({ stack: true }), json()),
      transports: [
        new transports.Console({
          format: combine(colorize(), simple())
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5
        }),
        new transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880,
          maxFiles: 5
        })
      ]
    });
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, { ...this.context, ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { ...this.context, ...meta });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { ...this.context, ...meta });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { ...this.context, ...meta });
  }

  child(additionalContext: LogContext): AppLogger {
    return new AppLogger({ ...this.context, ...additionalContext });
  }
}

export const logger = new AppLogger({ service: 'enterprise-form-platform' });
"@

New-Item -ItemType Directory -Path "src/logging" -Force | Out-Null
New-Item -ItemType Directory -Path "logs" -Force | Out-Null
$loggerCode | Out-File -FilePath "src/logging/Logger.ts" -Encoding UTF8

if (-not (Select-String -Path ".gitignore" -Pattern "logs/\*\.log" -Quiet)) {
    Add-Content -Path ".gitignore" -Value "`nlogs/*.log"
}

Write-Host "Created src/logging/Logger.ts" -ForegroundColor Green
