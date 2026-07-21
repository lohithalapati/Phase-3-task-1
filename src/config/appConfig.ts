import { AppConfig } from './types';
import { EnvReader } from './env';
import { DEFAULT_APP_CONFIG } from './defaults';
import { SchemaValidator } from './validation';

export function buildAppConfig(): AppConfig {
  const environment = EnvReader.getEnvironment();
  
  let resolvedBaseUrl = DEFAULT_APP_CONFIG.api.baseUrl;
  try {
    resolvedBaseUrl = EnvReader.get('NH_API_BASE_URL');
  } catch {
    if (environment === 'production') {
      throw new Error('CRITICAL CONFIGURATION TIMEOUT: Base URL configuration missing for production deployment.');
    }
  }

  const generated: AppConfig = {
    ...DEFAULT_APP_CONFIG,
    environment,
    api: {
      ...DEFAULT_APP_CONFIG.api,
      baseUrl: resolvedBaseUrl,
      timeoutMs: Number(EnvReader.get('NH_API_TIMEOUT_MS', String(DEFAULT_APP_CONFIG.api.timeoutMs))),
      retryCount: Number(EnvReader.get('NH_API_RETRY_COUNT', String(DEFAULT_APP_CONFIG.api.retryCount))),
    },
    logging: {
      level: EnvReader.get('NH_LOG_LEVEL', DEFAULT_APP_CONFIG.logging.level) as any,
      enableTelemetry: EnvReader.get('NH_ENABLE_TELEMETRY', 'false') === 'true',
    }
  };

  const check = SchemaValidator.validateConfig(generated);
  if (!check.success) {
    throw new Error(`CRITICAL BOOT CONFIG FAILURE: Verification violation detected.\n${check.errors.join('\n')}`);
  }

  return check.data;
}
