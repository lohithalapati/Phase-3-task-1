import { IConfigProvider, AppConfig, FeatureFlags } from '../types';
import { buildAppConfig } from '../appConfig';
import { resolveFeatureFlags } from '../featureFlags';
import { Logger } from '../../mocks/Logger';

export class LocalProvider implements IConfigProvider {
  private config: AppConfig;
  private flags: FeatureFlags;
  private listeners: Set<(config: AppConfig) => void> = new Set();

  constructor() {
    this.config = buildAppConfig();
    this.flags = resolveFeatureFlags();
    Logger.info('Sovereign Environment Engine loaded successfully.');
  }

  getConfig(): AppConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  getFeatureFlags(): FeatureFlags {
    return { ...this.flags };
  }

  onConfigChange(callback: (config: AppConfig) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  updateConfig(delta: Partial<AppConfig>): void {
    this.config = {
      ...this.config,
      ...delta,
      api: { ...this.config.api, ...delta.api },
      logging: { ...this.config.logging, ...delta.logging },
    };
    this.listeners.forEach(cb => cb(this.getConfig()));
  }
}
