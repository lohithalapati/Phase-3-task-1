import { AppConfig } from './types';
import { isAppConfig } from './schema';

export interface ValidationResult {
  success: boolean;
  errors: string[];
  data: AppConfig;
}

export const SchemaValidator = {
  validateConfig(config: unknown): ValidationResult {
    const errors: string[] = [];
    
    if (!isAppConfig(config)) {
      errors.push('[Configuration Error] Invalid configuration format.');
      return {
        success: false,
        errors,
        data: config as AppConfig
      };
    }

    const api = (config as any).api;
    if (api) {
      const timeout = api.timeoutMs !== undefined ? api.timeoutMs : (api as any).timeout;
      if (timeout === undefined || timeout <= 0) {
        errors.push('[Configuration Error] API Timeout must be greater than 0.');
      }
    } else {
      errors.push('[Configuration Error] API configuration block is missing.');
    }

    return {
      success: errors.length === 0,
      errors,
      data: config as AppConfig
    };
  }
};

export function validateConfig(config: unknown): AppConfig {
  const result = SchemaValidator.validateConfig(config);
  if (!result.success) {
    throw new Error(`[Configuration Error] Invalid configuration:\n${result.errors.join('\n')}`);
  }
  return result.data;
}
