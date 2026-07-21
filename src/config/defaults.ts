import { AppConfig, FeatureFlags } from './types';
import { CONFIG_CONSTANTS } from './constants';

export const DEFAULT_APP_CONFIG: AppConfig = {
  environment: 'development',
  api: {
    baseUrl: 'http://localhost:8080/api',
    timeoutMs: 15000,
    retryCount: 3,
    version: CONFIG_CONSTANTS.API_VERSION,
  },
  logging: {
    level: 'info',
    enableTelemetry: false,
  },
  security: {
    tokenStorageKey: `${CONFIG_CONSTANTS.LOCAL_STORAGE_PREFIX}token`,
    sessionTimeoutMs: CONFIG_CONSTANTS.SESSION_TIMEOUT_DEFAULT,
    enableCsrfProtection: true,
  },
  pagination: {
    defaultLimit: 25,
    maxLimit: CONFIG_CONSTANTS.DEFAULT_MAX_LIMIT,
  },
  localization: {
    defaultLocale: CONFIG_CONSTANTS.DEFAULT_LOCALE,
    fallbackLocale: CONFIG_CONSTANTS.FALLBACK_LOCALE,
  },
  theme: {
    defaultMode: 'system',
  },
  build: {
    version: '5.0.0',
    number: '0001',
  },
};

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableAiAssistant: false,
  enableKnowledgeGraph: false,
  enableOcr: false,
  enableAnalytics: false,
  enableCollaboration: false,
  enableAuditDashboard: false,
  enableExperimentalUi: false,
};
