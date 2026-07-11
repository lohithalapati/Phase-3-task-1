interface EnvSchema {
  NODE_ENV: 'development' | 'production' | 'test';
  API_URL: string;
  APP_URL: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  ENABLE_MOCK_API: boolean;
  REQUEST_TIMEOUT_MS: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`[Configuration Error]: Environment variable "${key}" is missing.`);
  }
  return value;
};

export const Env: EnvSchema = {
  NODE_ENV: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
  API_URL: getEnvVar('VITE_API_URL', 'https://api.neuralhandoff.com/v1'),
  APP_URL: getEnvVar('VITE_APP_URL', 'http://localhost:3000'),
  GOOGLE_OAUTH_CLIENT_ID: getEnvVar('VITE_GOOGLE_OAUTH_CLIENT_ID', ''),
  ENABLE_MOCK_API: getEnvVar('VITE_ENABLE_MOCK_API', 'false') === 'true',
  REQUEST_TIMEOUT_MS: parseInt(getEnvVar('VITE_REQUEST_TIMEOUT_MS', '30000'), 10),
};
