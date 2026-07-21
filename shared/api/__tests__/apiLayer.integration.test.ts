/**
 * @vitest-environment jsdom
 *
 * Integration tests for the full API layer pipeline.
 * Tests are written against the ACTUAL source behavior, not assumed behavior.
 *
 * Key facts about refresh.ts:
 * - Uses localStorage DIRECTLY (not a utility module)
 * - Has module-level isRefreshing state — must be reset between tests
 * - logRefresh calls apiLogger.info which calls console.info
 * - triggerSessionReset uses localStorage.removeItem directly
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { apiClient } from '../client/apiClient';
import { apiMetrics } from '../metrics/metrics';
import { BaseService } from '../services/baseService';
import { API_ENDPOINTS } from '../endpoints/registry';

// =============================================================================
// Helper: make a test service
// =============================================================================
class TestService extends BaseService {
  getProfile(cfg?: any) { return this.get<any>(API_ENDPOINTS.USER.PROFILE, cfg); }
}

// =============================================================================
// Helper: build a fake AxiosError that the interceptor recognises
// =============================================================================
function makeAxiosError(status: number, config: any): any {
  const err: any = new Error(`HTTP ${status}`);
  err.isAxiosError = true;
  err.response = { status, data: { message: `HTTP ${status}` } };
  err.config = config;
  return err;
}

// =============================================================================
// Setup
// =============================================================================
describe('API Layer Integration Tests', () => {
  let svc: TestService;
  let axiosPostSpy: ReturnType<typeof vi.spyOn>;

  // Spy on console methods so we can inspect log output
  let consoleSpy = {
    debug: null as any,
    info:  null as any,
    warn:  null as any,
    error: null as any,
  };

  // localStorage simulation — refresh.ts uses localStorage DIRECTLY
  let store: Record<string, string> = {};

  beforeEach(async () => {
    vi.clearAllMocks();
    apiMetrics.reset();
    svc = new TestService(apiClient);

    // Stub localStorage globally (jsdom already has one, but we want full control)
    store = {};
    vi.stubGlobal('localStorage', {
      getItem:    (k: string) => store[k] ?? null,
      setItem:    (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear:      () => { store = {}; },
    });

    // Stub window.dispatchEvent so session-reset events don't throw
    vi.stubGlobal('window', {
      ...window,
      dispatchEvent: vi.fn(),
    });

    // Spy on console methods
    consoleSpy.debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleSpy.info  = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleSpy.warn  = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleSpy.error = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Default axios.post mock (used by refresh pipeline)
    axiosPostSpy = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { accessToken: 'new-token', refreshToken: 'new-refresh' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Reset isRefreshing module-level state by re-importing with reset modules
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    apiClient.defaults.adapter = undefined;
    axiosPostSpy.mockRestore();
    consoleSpy.debug?.mockRestore();
    consoleSpy.info?.mockRestore();
    consoleSpy.warn?.mockRestore();
    consoleSpy.error?.mockRestore();
  });

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  describe('Request Lifecycle', () => {
    it('attaches Authorization header when accessToken is in localStorage', async () => {
      store['accessToken'] = 'my-token';
      let capturedAuth = '';

      apiClient.defaults.adapter = async (config: any) => {
        capturedAuth = config.headers?.['Authorization'] ?? '';
        return { data: { success: true, data: { name: 'Alice' } }, status: 200, statusText: 'OK', headers: {}, config };
      };

      const result = await svc.getProfile();
      expect(capturedAuth).toBe('Bearer my-token');
      expect(result.data.name).toBe('Alice');
    });

    it('attaches X-Correlation-ID and X-Client-Version headers', async () => {
      let corrId = '';
      let clientVer = '';

      apiClient.defaults.adapter = async (config: any) => {
        corrId    = config.headers?.['X-Correlation-ID'] ?? '';
        clientVer = config.headers?.['X-Client-Version'] ?? '';
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      };

      await svc.getProfile();
      expect(corrId).toBeTruthy();
      expect(clientVer).toBeTruthy();
    });

    it('increments request and success metrics on 200', async () => {
      apiClient.defaults.adapter = async (config: any) => (
        { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config }
      );

      await svc.getProfile();
      const snap = apiMetrics.getSnapshot();
      expect(snap.requests).toBe(1);
      expect(snap.successes).toBe(1);
    });
  });

  // ===========================================================================
  // RETRY PIPELINE
  // ===========================================================================
  describe('Retry Pipeline', () => {
    it('retries on 500 up to maxRetries times then rejects', async () => {
      let calls = 0;

      apiClient.defaults.adapter = async (config: any) => {
        calls++;
        throw makeAxiosError(500, { ...config, method: 'GET', retryCount: calls - 1, maxRetries: 2 });
      };

      await expect(svc.getProfile({ retryCount: 0, maxRetries: 2 })).rejects.toThrow();
      // 1 initial + 2 retries
      expect(calls).toBe(3);
      expect(apiMetrics.getSnapshot().retries).toBe(2);
    }, 15000);

    it('succeeds on second attempt after initial 503', async () => {
      let calls = 0;

      apiClient.defaults.adapter = async (config: any) => {
        calls++;
        if (calls === 1) {
          throw makeAxiosError(503, { ...config, method: 'GET', retryCount: 0, maxRetries: 1 });
        }
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      };

      const result = await svc.getProfile({ retryCount: 0, maxRetries: 1 });
      expect(calls).toBe(2);
      expect(result.success).toBe(true);
    }, 10000);

    it('does NOT retry on 400 (client error)', async () => {
      let calls = 0;

      apiClient.defaults.adapter = async (config: any) => {
        calls++;
        throw makeAxiosError(400, { ...config, method: 'GET', retryCount: 0, maxRetries: 3 });
      };

      await expect(svc.getProfile({ retryCount: 0, maxRetries: 3 })).rejects.toThrow();
      expect(calls).toBe(1); // No retry on 400
    });

    it('aborts retry delay when signal fires during delay', async () => {
      const ctrl = new AbortController();
      let calls = 0;

      apiClient.defaults.adapter = async (config: any) => {
        calls++;
        throw makeAxiosError(504, { ...config, method: 'GET', retryCount: 0, maxRetries: 3, signal: ctrl.signal });
      };

      const promise = svc.getProfile({ retryCount: 0, maxRetries: 3, signal: ctrl.signal });
      setTimeout(() => ctrl.abort(), 30);

      await expect(promise).rejects.toThrow();
      expect(calls).toBe(1); // Only one call before abort cancelled the delay
    });
  });

  // ===========================================================================
  // REFRESH PIPELINE
  // Uses localStorage directly. Session reset calls localStorage.removeItem.
  // ===========================================================================
  describe('Token Refresh Pipeline', () => {
    it('skips refresh when skipRefresh=true, rejects immediately', async () => {
      apiClient.defaults.adapter = async (config: any) => {
        throw makeAxiosError(401, { ...config, method: 'GET', skipRefresh: true });
      };

      await expect(svc.getProfile({ skipRefresh: true })).rejects.toThrow();
      expect(axiosPostSpy).not.toHaveBeenCalled();
    });

    it('clears tokens and throws when refreshToken is missing', async () => {
      store['accessToken'] = 'expired';
      // refreshToken not in store

      apiClient.defaults.adapter = async (config: any) => {
        throw makeAxiosError(401, { ...config, method: 'GET' });
      };

      await expect(svc.getProfile()).rejects.toThrow('No refresh token available');
      // triggerSessionReset removes both tokens from localStorage
      expect(store['accessToken']).toBeUndefined();
      expect(store['refreshToken']).toBeUndefined();
    });

    it('refreshes token and replays request on 401', async () => {
      store['accessToken']  = 'old-token';
      store['refreshToken'] = 'valid-refresh';

      axiosPostSpy.mockResolvedValue({
        data: { accessToken: 'fresh-token', refreshToken: 'fresh-refresh' },
        status: 200, statusText: 'OK', headers: {}, config: {},
      });

      let callCount = 0;

      apiClient.defaults.adapter = async (config: any) => {
        callCount++;
        // First call fails with 401 (old token), second call succeeds (new token replayed)
        if (callCount === 1) {
          throw makeAxiosError(401, { ...config, method: 'GET' });
        }
        return { data: { success: true, data: { name: 'Replayed' } }, status: 200, statusText: 'OK', headers: {}, config };
      };

      const result = await svc.getProfile();
      expect(result.success).toBe(true);
      expect(store['accessToken']).toBe('fresh-token');
      expect(store['refreshToken']).toBe('fresh-refresh');
      expect(axiosPostSpy).toHaveBeenCalledTimes(1);
    });

    it('queues concurrent 401s and performs exactly ONE refresh call', async () => {
      store['accessToken']  = 'expired';
      store['refreshToken'] = 'valid-refresh';

      let refreshCount = 0;
      axiosPostSpy.mockImplementation(async () => {
        refreshCount++;
        await new Promise(r => setTimeout(r, 40));
        store['accessToken']  = 'fresh-token';
        store['refreshToken'] = 'fresh-refresh';
        return { data: { accessToken: 'fresh-token', refreshToken: 'fresh-refresh' }, status: 200, statusText: 'OK', headers: {}, config: {} };
      });

      let adapterCalls = 0;

      apiClient.defaults.adapter = async (config: any) => {
        adapterCalls++;
        if (store['accessToken'] !== 'fresh-token') {
          throw makeAxiosError(401, { ...config, method: 'GET' });
        }
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      };

      const [r1, r2] = await Promise.all([svc.getProfile(), svc.getProfile()]);
      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(refreshCount).toBe(1); // SINGLE refresh
      expect(apiMetrics.getSnapshot().refreshes).toBe(1);
    });

    it('clears tokens and rejects all queued requests when refresh fails', async () => {
      store['accessToken']  = 'expired';
      store['refreshToken'] = 'bad-refresh';

      axiosPostSpy.mockRejectedValue(
        Object.assign(new Error('Refresh server error'), { isAxiosError: true, response: { status: 500, data: {} }, config: { headers: {} } })
      );

      apiClient.defaults.adapter = async (config: any) => {
        throw makeAxiosError(401, { ...config, method: 'GET' });
      };

      await expect(svc.getProfile()).rejects.toThrow();
      expect(store['accessToken']).toBeUndefined();
      expect(store['refreshToken']).toBeUndefined();
    });
  });
});
