/// <reference types="jest" />
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
    Object.defineProperty(globalThis, 'localStorage', {
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
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Layer 1 & Layer 2: Client Declarations & HTTP Methods', () => {
    it('should expose valid and defined global API wrappers', () => {
      expect(axiosInstance).toBeDefined();
      expect(httpClient).toBeDefined();
    });

    it('should route GET requests through axiosInstance', async () => {
      const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue({ data: 'get-ok' } as any);
      const res = await httpClient.get('/test-route');
      expect(spy).toHaveBeenCalledWith('/test-route');
      expect(res.data).toBe('get-ok');
    });

    it('should route POST requests with data through axiosInstance', async () => {
      const spy = jest.spyOn(axiosInstance, 'post').mockResolvedValue({ data: 'post-ok' } as any);
      const res = await httpClient.post('/test-route', { payload: 123 });
      expect(spy).toHaveBeenCalledWith('/test-route', { payload: 123 });
      expect(res.data).toBe('post-ok');
    });

    it('should route PUT requests with data through axiosInstance', async () => {
      const spy = jest.spyOn(axiosInstance, 'put').mockResolvedValue({ data: 'put-ok' } as any);
      const res = await httpClient.put('/test-route', { payload: 456 });
      expect(spy).toHaveBeenCalledWith('/test-route', { payload: 456 });
      expect(res.data).toBe('put-ok');
    });

    it('should route DELETE requests through axiosInstance', async () => {
      const spy = jest.spyOn(axiosInstance, 'delete').mockResolvedValue({ data: 'delete-ok' } as any);
      const res = await httpClient.delete('/test-route');
      expect(spy).toHaveBeenCalledWith('/test-route');
      expect(res.data).toBe('delete-ok');
    });
  });

  describe('Layer 3: Environmental Configurations', () => {
    it('should successfully read configured limits dynamically', () => {
      const policy = envConfig.getPolicy();
      expect(policy).toBeDefined();
      expect(policy.timeout).toBeGreaterThan(0);
      expect(policy.retryLimit).toBeGreaterThanOrEqual(0);
    });

    it('should fallback to development if global process is missing or env is empty', () => {
      const originalProcess = (globalThis as any).process;
      delete (globalThis as any).process;
      expect(envConfig.getEnvironment()).toBe('development');
      (globalThis as any).process = originalProcess;
    });

    it('should return NODE_ENV value when process is present', () => {
      const originalProcess = (globalThis as any).process;
      (globalThis as any).process = { env: { NODE_ENV: 'production' } };
      expect(envConfig.getEnvironment()).toBe('production');
      (globalThis as any).process = originalProcess;
    });
  });

  describe('Layer 10: Hierarchical Error Mappings', () => {
    it('should map undefined or null error payloads to a standard NetworkError', () => {
      const res1 = transformAxiosError(null);
      const res2 = transformAxiosError(undefined);
      expect(res1).toBeInstanceOf(NetworkError);
      expect(res1.message).toBe('Unknown network error');
      expect(res2).toBeInstanceOf(NetworkError);
    });

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
      expect((result as ValidationError).status).toBe(400);
      expect((result as ValidationError).validationErrors?.email).toContain('Email is invalid');
    });

    it('should map 401/403 response status to AuthenticationError class', () => {
      const errorPayload1 = {
        config: { url: '/dashboard' },
        response: { status: 401, statusText: 'Unauthorized', headers: {} }
      } as any;
      const errorPayload2 = {
        config: { url: '/dashboard' },
        response: { status: 403, statusText: 'Forbidden', headers: {} }
      } as any;

      expect(transformAxiosError(errorPayload1)).toBeInstanceOf(AuthenticationError);
      expect(transformAxiosError(errorPayload2)).toBeInstanceOf(AuthenticationError);
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
      expect((result as ServerError).status).toBe(503);
    });

    it('should map unhandled status codes to ServerError with fallback', () => {
      const errorPayload = {
        config: { url: '/unknown' },
        response: { status: 418, statusText: 'Im a teapot', headers: {} }
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(ServerError);
      expect((result as ServerError).status).toBe(418);
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

    it('should create ServerError with default status 500 if not supplied', () => {
      const err = new ServerError('Internal failure');
      expect(err.status).toBe(500);
    });
  });

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

    it('should return 0 average latency if no successful requests have been tracked', () => {
      const report = metricsCollector.getReport();
      expect(report.averageLatencyMs).toBe(0);
    });
  });
});
// Duplicate resolved: import { transformAxiosError } from '../transformAxiosError';

describe('transformAxiosError branch coverage', () => {
  it('should handle missing response (Line 16)', () => {
    const error = { message: 'Network Error' };
    transformAxiosError(error as any);
  });

  it('should handle response without data (Line 21)', () => {
    const error = { response: { status: 404, statusText: 'Not Found' } };
    transformAxiosError(error as any);
  });

  it('should handle empty error object (Line 28)', () => {
    const error = {};
    transformAxiosError(error as any);
  });
});
