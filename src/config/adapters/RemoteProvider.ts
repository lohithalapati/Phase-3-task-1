import { IConfigProvider, AppConfig, FeatureFlags } from '../types';
import { LocalProvider } from './LocalProvider';

export class RemoteProvider implements IConfigProvider {
  private baseFallback: LocalProvider;

  constructor() {
    this.baseFallback = new LocalProvider();
  }

  getConfig(): AppConfig {
    return this.baseFallback.getConfig();
  }

  getFeatureFlags(): FeatureFlags {
    return this.baseFallback.getFeatureFlags();
  }

  onConfigChange(callback: (config: AppConfig) => void): () => void {
    return this.baseFallback.onConfigChange(callback);
  }
}
