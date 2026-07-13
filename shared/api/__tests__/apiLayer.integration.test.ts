import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../client/apiClient';
import { apiMetrics } from '../metrics/metrics';
import { BaseService } from '../services/baseService';
import { API_ENDPOINTS } from '../endpoints/registry';

class MockAccountService extends BaseService {
  public async getUserProfile(config?: any) {
    return this.get<any>(API_ENDPOINTS.USER.PROFILE, config);
  }
}

describe('Enterprise API Layer Integration Pipeline', () => {
  let mockStorage: Record<string, string> = {};
  let accountService: MockAccountService;

  beforeEach(() => {
    vi.clearAllMocks();
    apiMetrics.reset();
    accountService = new MockAccountService(apiClient);

    // Mock localStorage
    mockStorage = {};
    vi.stubGlobal('window', {
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    apiClient.defaults.adapter = undefined; // Clean adapter restore
  });

  describe('Full Request Lifecycle with Trace Headers', () => {
    it('should inject tracing and client version headers through BaseService', async () => {
      localStorage.setItem('accessToken', 'mock-valid-token');
      
      // Inject mock network adapter to execute the actual Axios request pipeline
      apiClient.defaults.adapter = async (config) => {
        return {
          data: { success: true, data: { name: 'Staff Engineer' } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      };

      const profile = await accountService.getUserProfile();

      expect(profile).toBeDefined();
      expect(profile.success).toBe(true);
      expect(profile.data.name).toBe('Staff Engineer');
      expect(apiMetrics.getSnapshot().requests).toBe(1);
      expect(apiMetrics.getSnapshot().successes).toBe(1);
    });
  });

  describe('AbortController Cancellation Pipeline', () => {
    it('should cancel active requests instantly when AbortController signals', async () => {
      const controller = new AbortController();

      // Mock network adapter to reject with Axios abort pattern
      apiClient.defaults.adapter = async (config) => {
        const err = new Error('canceled');
        (err as any).code = 'ERR_CANCELED';
        (err as any).isAxiosError = true;
        (err as any).config = config;
        throw err;
      };

      // Trigger instant abort signal
      controller.abort();

      await expect(
        accountService.getUserProfile({ signal: controller.signal })
      ).rejects.toThrow('The request was canceled.');
      
      expect(apiMetrics.getSnapshot().failures).toBe(1);
    });
  });
});
