import { InternalAxiosRequestConfig } from 'axios';

export interface ExtendedRequestConfig extends InternalAxiosRequestConfig {
  correlationId?: string;
  startTime?: number;
  skipAuth?: boolean;
  skipRetry?: boolean;
  skipRefresh?: boolean;
  maxRetries?: number;
  retryCount?: number;
}
