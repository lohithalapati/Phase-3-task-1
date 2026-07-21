export type Environment = 'development' | 'test' | 'staging' | 'production';

export interface AppConfig {
  environment: Environment;
  api: {
    baseUrl: string;
    timeoutMs: number;
    retryCount: number;
    version: string;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableTelemetry: boolean;
  };
  security: {
    tokenStorageKey: string;
    sessionTimeoutMs: number;
    enableCsrfProtection: boolean;
  };
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
  localization: {
    defaultLocale: string;
    fallbackLocale: string;
  };
  theme: {
    defaultMode: 'light' | 'dark' | 'system';
  };
  build: {
    version: string;
    number: string;
  };
}

export interface FeatureFlags {
  enableAiAssistant: boolean;
  enableKnowledgeGraph: boolean;
  enableOcr: boolean;
  enableAnalytics: boolean;
  enableCollaboration: boolean;
  enableAuditDashboard: boolean;
  enableExperimentalUi: boolean;
}

export interface IConfigProvider {
  getConfig(): AppConfig;
  getFeatureFlags(): FeatureFlags;
  onConfigChange(callback: (config: AppConfig) => void): () => void;
}
