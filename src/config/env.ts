import { Environment } from './types';

export class EnvReader {
  static get(key: string, fallback?: string): string {
    const globalCtx = typeof window !== 'undefined' ? window : globalThis;
    const processEnv = (globalCtx as any).process?.env || {};
    const importMetaEnv = (globalCtx as any).import?.meta?.env || {};
    const runtimeConfig = (globalCtx as any).__NH_CONFIG__ || {};

    const resolved = runtimeConfig[key] || processEnv[key] || importMetaEnv[key];
    if (resolved === undefined || resolved === null || resolved === '') {
      if (fallback !== undefined) return fallback;
      throw new Error(`CRITICAL SYSTEM FAILURE: Required variable environment [${key}] is undefined.`);
    }
    return String(resolved);
  }

  static getEnvironment(): Environment {
    const target = EnvReader.get('NODE_ENV', 'development').toLowerCase();
    if (target.startsWith('dev')) return 'development';
    if (target.startsWith('test')) return 'test';
    if (target.startsWith('stag')) return 'staging';
    if (target.startsWith('prod')) return 'production';
    return 'development';
  }
}
