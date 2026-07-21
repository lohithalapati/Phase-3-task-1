export interface EnvConfig {
  apiBaseUrl: string;
  timeout: number;
  maxRetries: number;
  clientVersion: string;
  isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue: string): string => {
  const val = (import.meta as any).env?.[key] || (process as any).env?.[key] || defaultValue;
  return val;
};

const rawBaseUrl = getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/api/v1');
const rawTimeout = getEnvVar('VITE_API_TIMEOUT', '15000');
const rawRetries = getEnvVar('VITE_API_RETRY_LIMIT', '3');
const clientVersion = getEnvVar('VITE_CLIENT_VERSION', '1.0.0');
const nodeEnv = getEnvVar('NODE_ENV', 'development');

if (!rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://')) {
  console.warn(`[API Config Warning]: VITE_API_BASE_URL ("${rawBaseUrl}") is missing protocol prefix.`);
}

export const envConfig: EnvConfig = {
  apiBaseUrl: rawBaseUrl,
  timeout: parseInt(rawTimeout, 10) || 15000,
  maxRetries: parseInt(rawRetries, 10) || 3,
  clientVersion,
  isProduction: nodeEnv === 'production',
};
