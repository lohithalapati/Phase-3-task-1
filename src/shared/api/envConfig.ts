export interface Policy {
  timeout: number;
  retryLimit: number;
}

class EnvConfig {
  getEnvironment(): string {
    return process.env.NODE_ENV || 'development';
  }

  getPolicy(): Policy {
    return {
      timeout: 10000,
      retryLimit: 3
    };
  }
}

export const envConfig = new EnvConfig();