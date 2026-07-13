import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapToApiError } from '../errors/mapError';
import { getJitterDelay } from '../retry/jitter';
import { apiMetrics } from '../metrics/metrics';
import { HEADER_CORRELATION_ID } from '../constants/headers';
import { requestInterceptor } from '../interceptors/request';

vi.mock('axios', async () => {
  const actual = await vi.importActual('axios') as any;
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => {
        const mockInstance = {
          interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn(), eject: vi.fn() },
          },
          get: vi.fn(),
          post: vi.fn(),
          put: vi.fn(),
          delete: vi.fn(),
        };
        return mockInstance;
      }),
      post: vi.fn(),
    },
  };
});

describe('Enterprise API Layer Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMetrics.reset();
  });

  describe('Correlation Identity', () => {
    it('should generate a correlation ID on requests', () => {
      const config = { headers: {} } as any;
      const processed = requestInterceptor(config);
      expect(processed.headers[HEADER_CORRELATION_ID]).toBeDefined();
      expect(processed.correlationId).toBeDefined();
    });
  });

  describe('Metrics Instrument Tracking', () => {
    it('should record requests and responses metrics correctly', () => {
      apiMetrics.incrementRequests();
      apiMetrics.incrementSuccesses();
      apiMetrics.trackLatency(150);

      const stats = apiMetrics.getSnapshot();
      expect(stats.requests).toBe(1);
      expect(stats.successes).toBe(1);
      expect(stats.averageLatencyMs).toBe(150);
    });
  });

  describe('Mathematical Jitter Evaluation', () => {
    it('should stay within bounds during exponential backoff calls', () => {
      const base = 1000;
      const max = 5000;
      for (let i = 1; i <= 3; i++) {
        const delay = getJitterDelay(i, base, max);
        expect(delay).toBeGreaterThanOrEqual(0);
        expect(delay).toBeLessThanOrEqual(max);
      }
    });
  });

  describe('Error Mapping Engine', () => {
    it('should map timeout failures into TIMEOUT_ERROR categories', () => {
      const mockAxiosError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 15000ms exceeded',
        config: { headers: {} },
      };

      const mapped = mapToApiError(mockAxiosError);
      expect(mapped.category).toBe('TIMEOUT_ERROR');
      expect(mapped.status).toBe(408);
    });

    it('should classify typical 401s as UNAUTHORIZED category', () => {
      const mockAxiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: 'Unauthorized session' },
        },
        config: { headers: {} },
      };

      const mapped = mapToApiError(mockAxiosError);
      expect(mapped.category).toBe('UNAUTHORIZED');
      expect(mapped.status).toBe(401);
    });
  });
});
