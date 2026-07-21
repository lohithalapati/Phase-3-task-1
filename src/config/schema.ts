import { AppConfig } from './types';

export function isAppConfig(data: unknown): data is AppConfig {
    if (typeof data !== 'object' || data === null) return false;
    const config = data as Record<string, any>;
    
    // Support both 'environment' (used in configuration mapping) and fallback 'env' key
    const envVal = config.environment || config.env;
    if (typeof envVal !== 'string') return false;
    
    if (typeof config.api !== 'object' || config.api === null) return false;
    
    return true;
}
