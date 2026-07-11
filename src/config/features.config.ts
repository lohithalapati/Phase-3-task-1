import { Env } from './env.config';

export interface FeatureFlags {
  enableOAuth: boolean;
  enableBillingUI: boolean;
  enableAdvancedMetrics: boolean;
  enableSAML: boolean;
}

const defaultFlags: FeatureFlags = {
  enableOAuth: true,
  enableBillingUI: Env.NODE_ENV !== 'production',
  enableAdvancedMetrics: false,
  enableSAML: false,
};

export const FeatureFlagSystem = {
  getFlags(): FeatureFlags {
    return defaultFlags;
  },

  isEnabled(flag: keyof FeatureFlags): boolean {
    return defaultFlags[flag] ?? false;
  },
};
