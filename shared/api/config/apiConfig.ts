import { envConfig } from './env';

export const apiConfig = {
  baseUrl: envConfig.apiBaseUrl,
  timeout: envConfig.timeout,
  retryPolicy: {
    maxRetries: envConfig.maxRetries,
    baseDelayMs: 1000,
    maxDelayMs: 5000,
  },
  security: {
    authHeaderType: 'Bearer',
    sessionResetEvent: 'auth:session_reset',
  },
  version: envConfig.clientVersion,
  isProduction: envConfig.isProduction,
};
