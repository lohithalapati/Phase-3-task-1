import { transformAxiosError } from '../transformAxiosError';
import { metricsCollector } from '../metricsCollector';
import { envConfig } from '../envConfig';
import { axiosInstance, httpClient } from '../client';
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  ServerError,
  TimeoutError,
  NetworkError
} from '../errors';

describe('Platinum API Network Layer Tests', () => {
  let mockStorage: Record<string, string> = {};

  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => { mockStorage[key] = value; },
        removeItem: (key: string) => { delete mockStorage[key]; },
        clear: () => { mockStorage = {}; }
      },
      writable: true
    });
  });

  beforeEach(() => {
    mockStorage = {};
    metricsCollector.clear();
    if (typeof jest !== 'undefined') {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    }
  });

  // 1. Unified Domain Error Mappings
  describe('Layer 10: Hierarchical Error Mappings', () => {
    it('should map a status 400 validation error correctly', () => {
      const errorPayload = {
        config: { url: '/users' },
        name: 'AxiosError',
        message: 'Request failed',
        response: {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {},
          data: {
            error: {
              message: 'Invalid payload schema',
              validationErrors: { email: ['Email is invalid'] }
            }
          }
        }
      } as any;
      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(ValidationError);
      expect(result.status).toBe(400);
      expect(result.validationErrors?.email).toContain('Email is invalid');
    });

    it('should map 401 response status to AuthenticationError class', () => {
      const errorPayload = {
        config: { url: '/dashboard' },
        response: { status: 401, statusText: 'Unauthorized', headers: {} }
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(AuthenticationError);
    });

    it('should map 409 response status to ConflictError class', () => {
      const errorPayload = {
        config: { url: '/resource' },
        response: { status: 409, statusText: 'Conflict', headers: {} }
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(ConflictError);
    });

    it('should map 503 response status to ServerError class', () => {
      const errorPayload = {
        config: { url: '/gateway' },
        response: { status: 503, statusText: 'Service Unavailable', headers: {} }
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(ServerError);
    });

    it('should map connection timeouts to TimeoutError class', () => {
      const errorPayload = {
        config: { url: '/users' },
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
        response: undefined
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(TimeoutError);
    });

    it('should map missing response attributes to NetworkError class', () => {
      const errorPayload = {
        config: { url: '/users' },
        message: 'Network Error',
        response: undefined
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(NetworkError);
    });
  });

  // 2. Metrics telemetry validations
  describe('Layer 13: In-Memory Metric Metrics Collector', () => {
    it('should register request increments and accumulate latency records', () => {
      metricsCollector.trackRequest();
      metricsCollector.trackSuccess(100);
      metricsCollector.trackSuccess(300);
      metricsCollector.trackFailure();
      metricsCollector.trackRetry();
      metricsCollector.trackRefresh();
      const report = metricsCollector.getReport();
      expect(report.totalRequests).toBe(1);
      expect(report.successfulRequests).toBe(2);
      expect(report.failedRequests).toBe(1);
      expect(report.totalRetries).toBe(1);
      expect(report.totalRefreshes).toBe(1);
      expect(report.averageLatencyMs).toBe(200);
    });
  });

  // 3. Multi-Environment Policy Mapping
  describe('Layer 3: Environmental Configurations', () => {
    it('should successfully read configured limits dynamically', () => {
      const policy = envConfig.getPolicy();
      expect(policy).toBeDefined();
      expect(policy.timeout).toBeGreaterThan(0);
      expect(policy.retryLimit).toBeGreaterThanOrEqual(0);
      expect(envConfig.getEnvironment()).toBeDefined();
    });
  });

  // 4. Client Singletons
  describe('Layer 1 & Layer 2: Client Declarations', () => {
    it('should expose valid and defined global API wrappers', () => {
      expect(axiosInstance).toBeDefined();
      expect(httpClient).toBeDefined();
    });
  });
});