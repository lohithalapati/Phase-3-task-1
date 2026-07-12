export type AppEnvironment = 'development' | 'test' | 'qa' | 'staging' | 'production';

export interface EnvironmentPolicy {
  baseUrl: string;
  timeout: number;
  retryLimit: number;
  retryDelayFactor: number;
  loggingEnabled: boolean;
  mockEnabled: boolean;
  collectMetrics: boolean;
}

const ENVIRONMENT_POLICIES: Record<AppEnvironment, EnvironmentPolicy> = {
  development: {
    baseUrl: 'https://dev.api.neuralhandoff.internal/v1',
    timeout: 10000,
    retryLimit: 2,
    retryDelayFactor: 1000,
    loggingEnabled: true,
    mockEnabled: true,
    collectMetrics: true,
  },
  test: {
    baseUrl: 'https://test.api.neuralhandoff.internal/v1',
    timeout: 5000,
    retryLimit: 1,
    retryDelayFactor: 100,
    loggingEnabled: false,
    mockEnabled: true,
    collectMetrics: false,
  },
  qa: {
    baseUrl: 'https://qa.api.neuralhandoff.internal/v1',
    timeout: 15000,
    retryLimit: 3,
    retryDelayFactor: 1500,
    loggingEnabled: true,
    mockEnabled: false,
    collectMetrics: true,
  },
  staging: {
    baseUrl: 'https://staging.api.neuralhandoff.internal/v1',
    timeout: 15000,
    retryLimit: 3,
    retryDelayFactor: 1500,
    loggingEnabled: true,
    mockEnabled: false,
    collectMetrics: true,
  },
  production: {
    baseUrl: 'https://api.neuralhandoff.com/v1',
    timeout: 20000,
    retryLimit: 3,
    retryDelayFactor: 2000,
    loggingEnabled: false,
    mockEnabled: false,
    collectMetrics: true,
  },
};

class EnvironmentResolver {
  private currentEnv: AppEnvironment;

  constructor() {
    const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
    const appEnv = (process.env.REACT_APP_ENV || nodeEnv) as AppEnvironment;
    
    if (appEnv in ENVIRONMENT_POLICIES) {
      this.currentEnv = appEnv;
    } else {
      this.currentEnv = 'development';
    }
  }

  public getEnvironment(): AppEnvironment {
    return this.currentEnv;
  }

  public getPolicy(): EnvironmentPolicy {
    return ENVIRONMENT_POLICIES[this.currentEnv];
  }

  public isDevelopment(): boolean {
    return this.currentEnv === 'development';
  }

  public isProduction(): boolean {
    return this.currentEnv === 'production';
  }
}

export const envConfig = new EnvironmentResolver();