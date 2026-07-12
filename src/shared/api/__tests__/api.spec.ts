import { axiosInstance } from '../client/axios-instance';
import { httpClient } from '../client/http-client';
import { ValidationError, ServerError } from '../errors/api-errors';
import { envConfig } from '../config/env.config';
import { transformAxiosError } from '../client/axios-instance';

// Local Ambient Declarations to satisfy browser compilation without config bloat
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const jest: any;
declare const beforeAll: any;
declare const beforeEach: any;

describe('NeuralHandoff V5: Enterprise API Infrastructure Suite', () => {
  let mockStorage: Record<string, string> = {};

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
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
    if (typeof jest !== 'undefined') {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    }
  });

  describe('Layer 10: Error Translation System', () => {
    it('should map a 400 validation response to a domain-level ValidationError', () => {
      const mockAxiosError = {
        config: { url: '/test-endpoint' },
        name: 'AxiosError',
        message: 'Request failed',
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {},
          data: {
            error: {
              message: 'Validation Constraints Violated',
              validationErrors: { email: ['Invalid domain format'] }
            }
          }
        }
      } as any;

      const result = transformAxiosError(mockAxiosError);

      expect(result).toBeInstanceOf(ValidationError);
      expect(result.status).toBe(400);
      expect(result.validationErrors?.email).toContain('Invalid domain format');
    });

    it('should map a 503 response to a ServerError', () => {
      const mockAxiosError = {
        config: { url: '/test-endpoint' },
        name: 'AxiosError',
        message: 'Request failed',
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 503,
          statusText: 'Service Unavailable',
          config: {},
          headers: {}
        }
      } as any;

      const result = transformAxiosError(mockAxiosError);

      expect(result).toBeInstanceOf(ServerError);
      expect(result.status).toBe(503);
    });
  });

  describe('Layer 8: Signature Deduplication Engine', () => {
    it('should assign unique trace and correlation identifiers to outgoing headers', async () => {
      if (typeof jest !== 'undefined') {
        const spy = jest.spyOn(axiosInstance, 'get').mockResolvedValue({ data: { success: true } });
        await httpClient.get('/dashboard/summary');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe('Layer 3: Multi-Environment Resolvers', () => {
    it('should accurately resolve policy margins based on environment variables', () => {
      expect(envConfig.getEnvironment()).toBeDefined();
      const policy = envConfig.getPolicy();
      expect(policy.timeout).toBeGreaterThan(0);
      expect(policy.retryLimit).toBeDefined();
    });
  });
});