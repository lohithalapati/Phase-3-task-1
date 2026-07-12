export interface Policy {
  timeout: number;
  retryLimit: number;
}

class EnvConfig {
  getEnvironment(): string {
    const globalProcess = (globalThis as any).process;
    return (globalProcess?.env?.NODE_ENV) || 'development';
  }

  getPolicy(): Policy {
    return {
      timeout: 10000,
      retryLimit: 3
    };
  }
}

export const envConfig = new EnvConfig();