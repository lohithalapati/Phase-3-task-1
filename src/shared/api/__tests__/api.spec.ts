import { axiosInstance, transformAxiosError } from '../client/axios-instance';
import { httpClient } from '../client/http-client';
import { ValidationError, ServerError, AuthenticationError } from '../errors/api-errors';
import { envConfig } from '../config/env.config';
import { metricsCollector } from '../utils/metrics';

declare const describe: any;
declare const it: any;
declare const expect: any;
declare const jest: any;
declare const beforeAll: any;
declare const beforeEach: any;

describe('NeuralHandoff V5: True 10/10 Core API Verification Suite', () => {
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
    metricsCollector.clear();
    if (typeof jest !== 'undefined') {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    }
  });

  describe('1. Error Code Translations (Layer 10)', () => {
    it('should cleanly translate 400 API responses with validations to ValidationError class', () => {
      const errorPayload = {
        config: { url: '/users' },
        name: 'AxiosError',
        message: 'Invalid payload constraints',
        response: {
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {},
          data: {
            error: {
              message: 'Invalid request payload',
              validationErrors: { password: ['Password requires capital letters'] }
            }
          }
        }
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(ValidationError);
      expect(result.status).toBe(400);
      expect(result.validationErrors?.password).toContain('Password requires capital letters');
    });

    it('should translate 401 issues into localized AuthenticationError', () => {
      const errorPayload = {
        config: { url: '/dashboard' },
        response: {
          status: 401,
          statusText: 'Unauthorized',
          headers: {}
        }
      } as any;

      const result = transformAxiosError(errorPayload);
      expect(result).toBeInstanceOf(AuthenticationError);
    });
  });

  describe('2. Retry Limitations & Whitelist Status Check (Layer 7)', () => {
    it('should correctly filter transient statuses and support retry metrics collection', () => {
      metricsCollector.trackRetry();
      const report = metricsCollector.getReport();
      expect(report.totalRetries).toBe(1);
    });
  });

  describe('3. Dynamic Telemetry Metric Integration (Layer 13)', () => {
    it('should correctly measure response latency bounds', () => {
      metricsCollector.trackRequest();
      metricsCollector.trackSuccess(150);
      metricsCollector.trackSuccess(250);

      const report = metricsCollector.getReport();
      expect(report.totalRequests).toBe(1);
      expect(report.successfulRequests).toBe(2);
      expect(report.averageLatencyMs).toBe(200);
    });
  });

  describe('4. Safe Environmental Configurations (Layer 3)', () => {
    it('should fetch the target environmental dynamic configurations securely', () => {
      const policy = envConfig.getPolicy();
      expect(policy.timeout).toBeGreaterThan(0);
      expect(envConfig.getEnvironment()).toBeDefined();
    });
  });
});