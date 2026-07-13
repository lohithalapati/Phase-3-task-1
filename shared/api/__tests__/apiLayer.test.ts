/**
 * @vitest-environment jsdom
 *
 * All assertions are derived directly from reading the actual source files.
 * No assumption is made about internal behavior — everything is verified first.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// -- Utilities ----------------------------------------------------------------
import { isIdempotentRequest } from '../utils/isIdempotent';
import { generateCorrelationId } from '../utils/correlationId';
import { sanitizePayload } from '../utils/sanitize';

// -- Retry --------------------------------------------------------------------
import { getJitterDelay } from '../retry/jitter';
import { shouldRetry } from '../retry/policy';

// -- Errors -------------------------------------------------------------------
import { mapToApiError } from '../errors/mapError';
import { ApiError } from '../errors/ApiError';

// -- Logging ------------------------------------------------------------------
import { logResponse, logRetry, logRequest, logRefresh } from '../logging/requestLog';

// -- Metrics ------------------------------------------------------------------
import { apiMetrics } from '../metrics/metrics';

// -- Services / Endpoints / DTO -----------------------------------------------
import { BaseService } from '../services/baseService';
import { API_ENDPOINTS } from '../endpoints/registry';
import { mapResponseDto } from '../transformers/mapDto';

// =============================================================================
// LOGGER TESTS
// logger.ts uses console.* directly with a timestamp prefix.
// It has no `enabled` flag — isDev is private and always true.
// =============================================================================
describe('Logger (CentralLogger) - console spy approach', () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy:  ReturnType<typeof vi.spyOn>;
  let warnSpy:  ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Import the REAL logger (not mocked) so we test actual behaviour
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy  = vi.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy  = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    debugSpy.mockRestore();
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('debug() calls console.debug with [API DEBUG] prefix and timestamp', async () => {
    const { apiLogger } = await import('../logging/logger');
    apiLogger.debug('hello debug');
    expect(debugSpy).toHaveBeenCalledTimes(1);
    const [msg] = debugSpy.mock.calls[0];
    expect(msg).toMatch(/^\[API DEBUG\] \[.+\] hello debug$/);
  });

  it('info() calls console.info with [API INFO] prefix', async () => {
    const { apiLogger } = await import('../logging/logger');
    apiLogger.info('hello info');
    expect(infoSpy).toHaveBeenCalledTimes(1);
    const [msg] = infoSpy.mock.calls[0];
    expect(msg).toMatch(/^\[API INFO\] \[.+\] hello info$/);
  });

  it('warn() calls console.warn with [API WARN] prefix', async () => {
    const { apiLogger } = await import('../logging/logger');
    apiLogger.warn('hello warn');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const [msg] = warnSpy.mock.calls[0];
    expect(msg).toMatch(/^\[API WARN\] \[.+\] hello warn$/);
  });

  it('error() calls console.error with [API ERROR] prefix', async () => {
    const { apiLogger } = await import('../logging/logger');
    apiLogger.error('hello error', new Error('boom'));
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const [msg, extra] = errorSpy.mock.calls[0];
    expect(msg).toMatch(/^\[API ERROR\] \[.+\] hello error$/);
    expect(extra).toBeInstanceOf(Error);
  });

  it('debug() forwards extra args', async () => {
    const { apiLogger } = await import('../logging/logger');
    apiLogger.debug('msg', { key: 'value' });
    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy.mock.calls[0][1]).toEqual({ key: 'value' });
  });
});

// =============================================================================
// METRICS TESTS
// metrics.ts uses metricStore counter object (shared module-level state).
// averageLatencyMs = totalLatencyMs / requests (NOT number of trackLatency calls)
// =============================================================================
describe('Metrics (apiMetrics)', () => {
  beforeEach(() => { apiMetrics.reset(); });

  it('reset() zeroes all counters', () => {
    apiMetrics.incrementRequests();
    apiMetrics.reset();
    const s = apiMetrics.getSnapshot();
    expect(s.requests).toBe(0);
    expect(s.successes).toBe(0);
    expect(s.failures).toBe(0);
    expect(s.retries).toBe(0);
    expect(s.refreshes).toBe(0);
    expect(s.totalLatencyMs).toBe(0);
    expect(s.averageLatencyMs).toBe(0);
  });

  it('incrementRequests / Successes / Failures / Retries / Refreshes', () => {
    apiMetrics.incrementRequests();
    apiMetrics.incrementRequests();
    apiMetrics.incrementSuccesses();
    apiMetrics.incrementFailures();
    apiMetrics.incrementRetries();
    apiMetrics.incrementRefreshes();
    const s = apiMetrics.getSnapshot();
    expect(s.requests).toBe(2);
    expect(s.successes).toBe(1);
    expect(s.failures).toBe(1);
    expect(s.retries).toBe(1);
    expect(s.refreshes).toBe(1);
  });

  it('averageLatencyMs = totalLatencyMs / requests', () => {
    apiMetrics.incrementRequests();
    apiMetrics.incrementRequests();
    apiMetrics.trackLatency(100);
    apiMetrics.trackLatency(300);
    // totalLatencyMs=400, requests=2 ? avg=200
    expect(apiMetrics.getSnapshot().averageLatencyMs).toBe(200);
  });

  it('averageLatencyMs = 0 when requests = 0', () => {
    apiMetrics.trackLatency(999);
    expect(apiMetrics.getSnapshot().averageLatencyMs).toBe(0);
  });

  it('trackLatency accumulates', () => {
    apiMetrics.incrementRequests();
    apiMetrics.trackLatency(50);
    apiMetrics.trackLatency(150);
    expect(apiMetrics.getSnapshot().totalLatencyMs).toBe(200);
  });
});

// =============================================================================
// CORRELATION ID TESTS
// Format: crypto.randomUUID() OR 'corr-' + random + '-' + Date.now().toString(36)
// NOTE: random part is FIRST, timestamp part is SECOND in the fallback
// =============================================================================
describe('generateCorrelationId()', () => {
  it('uses crypto.randomUUID when available', () => {
    const orig = window.crypto.randomUUID;
    window.crypto.randomUUID = vi.fn(() => 'test-uuid-1234' as `${string}-${string}-${string}-${string}-${string}`);
    expect(generateCorrelationId()).toBe('test-uuid-1234');
    window.crypto.randomUUID = orig;
  });

  it('falls back to corr-<random>-<timestamp> when crypto is unavailable', () => {
    const origCrypto = window.crypto;
    vi.stubGlobal('crypto', undefined);
    const id = generateCorrelationId();
    // Format: corr-<Math.random().toString(36).substring(2,15)>-<Date.now().toString(36)>
    // random part: 2-13 chars (substring(2,15) from a base36 string)
    // timestamp part: variable length base36 timestamp
    expect(id).toMatch(/^corr-[a-z0-9]{2,13}-[a-z0-9]+$/);
    vi.stubGlobal('crypto', origCrypto);
  });
});

// =============================================================================
// SANITIZE PAYLOAD TESTS
// =============================================================================
describe('sanitizePayload()', () => {
  it('redacts sensitive keys at root level', () => {
    const result = sanitizePayload({ password: 'secret', token: 'tok', username: 'user' });
    expect(result.password).toBe('[REDACTED]');
    expect(result.token).toBe('[REDACTED]');
    expect(result.username).toBe('user');
  });

  it('redacts sensitive keys recursively in nested objects', () => {
    const result = sanitizePayload({ nested: { cvv: '123', normal: 'ok' } });
    expect(result.nested.cvv).toBe('[REDACTED]');
    expect(result.nested.normal).toBe('ok');
  });

  it('passes through null, undefined, strings, numbers', () => {
    expect(sanitizePayload(null)).toBeNull();
    expect(sanitizePayload(undefined)).toBeUndefined();
    expect(sanitizePayload('hello')).toBe('hello');
    expect(sanitizePayload(42)).toBe(42);
  });

  it('handles empty object', () => {
    expect(sanitizePayload({})).toEqual({});
  });

  it('handles cyclic objects gracefully', () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    expect(() => sanitizePayload(obj)).not.toThrow();
  });
});

// =============================================================================
// IDEMPOTENCY TESTS
// =============================================================================
describe('isIdempotentRequest()', () => {
  it('returns true for GET, HEAD, OPTIONS, PUT, DELETE (case-insensitive)', () => {
    for (const m of ['GET','get','HEAD','OPTIONS','PUT','DELETE']) {
      expect(isIdempotentRequest(m)).toBe(true);
    }
  });

  it('returns false for POST, PATCH, undefined, null, empty', () => {
    for (const m of ['POST','PATCH', undefined, null, '']) {
      expect(isIdempotentRequest(m as any)).toBe(false);
    }
  });
});

// =============================================================================
// API ERROR TESTS
// =============================================================================
describe('ApiError', () => {
  it('has default message, category, code when constructed with no args', () => {
    const e = new ApiError();
    expect(e.message).toBe('An unknown runtime error occurred.');
    expect(e.category).toBe('UNKNOWN');
    expect(e.code).toBe('UNKNOWN_ERROR');
    expect(e.timestamp).toBeDefined();
  });

  it('accepts partial payload', () => {
    const e = new ApiError({ message: 'oops', category: 'BAD_REQUEST', code: 'ERR' });
    expect(e.message).toBe('oops');
    expect(e.category).toBe('BAD_REQUEST');
    expect(e.code).toBe('ERR');
  });

  it('is an instance of Error', () => {
    expect(new ApiError()).toBeInstanceOf(Error);
  });
});

// =============================================================================
// MAP TO API ERROR TESTS
// =============================================================================
describe('mapToApiError()', () => {
  it('returns the same ApiError instance unchanged', () => {
    const e = new ApiError({ message: 'x', category: 'NOT_FOUND' });
    expect(mapToApiError(e)).toBe(e);
  });

  it('wraps a standard Error as UNKNOWN', () => {
    const mapped = mapToApiError(new Error('boom'));
    expect(mapped.category).toBe('UNKNOWN');
    expect(mapped.message).toBe('boom');
    expect(mapped.code).toBe('UNKNOWN_ERROR');
  });

  it('wraps a string primitive', () => {
    const mapped = mapToApiError('raw string error');
    expect(mapped.category).toBe('UNKNOWN');
    expect(mapped.message).toBe('raw string error');
  });

  it('wraps a number primitive', () => {
    expect(mapToApiError(42).message).toBe('42');
  });

  it('wraps a boolean primitive', () => {
    expect(mapToApiError(false).message).toBe('false');
  });

  it('wraps a plain object', () => {
    expect(mapToApiError({ code: 'X' }).message).toBe('{"code":"X"}');
  });

  it('falls back to default message for null', () => {
    expect(mapToApiError(null).message).toBe('An unknown runtime error occurred.');
  });

  it.each([
    [400, 'BAD_REQUEST'],
    [401, 'UNAUTHORIZED'],
    [403, 'FORBIDDEN'],
    [404, 'NOT_FOUND'],
    [409, 'CONFLICT'],
    [422, 'VALIDATION_ERROR'],
    [429, 'TOO_MANY_REQUESTS'],
    [500, 'SERVER_ERROR'],
    [502, 'SERVER_ERROR'],
    [503, 'SERVER_ERROR'],
    [504, 'SERVER_ERROR'],
    [418, 'UNKNOWN'],
  ])('maps HTTP %i ? category %s', (status, expectedCategory) => {
    const err = {
      isAxiosError: true,
      response: { status, data: { message: 'err', code: 'CODE' } },
      config: { headers: { 'X-Correlation-ID': 'trace-1' } },
      message: 'Axios error',
    };
    expect(mapToApiError(err).category).toBe(expectedCategory);
  });

  it('maps ECONNABORTED ? TIMEOUT_ERROR', () => {
    expect(mapToApiError({ isAxiosError: true, code: 'ECONNABORTED', message: 'conn aborted', config: { headers: {} } }).category).toBe('TIMEOUT_ERROR');
  });

  it('maps message containing "timeout" ? TIMEOUT_ERROR', () => {
    expect(mapToApiError({ isAxiosError: true, code: 'OTHER', message: 'request timeout occurred', config: { headers: {} } }).category).toBe('TIMEOUT_ERROR');
  });

  it('maps ERR_CANCELED ? CANCELED', () => {
    expect(mapToApiError({ isAxiosError: true, code: 'ERR_CANCELED', message: 'canceled', config: { headers: {} } }).category).toBe('CANCELED');
  });

  it('maps no-response Axios error ? NETWORK_ERROR', () => {
    expect(mapToApiError({ isAxiosError: true, message: 'Network Error', config: { headers: {} } }).category).toBe('NETWORK_ERROR');
  });

  it('maps no-response no-message Axios error ? NETWORK_ERROR', () => {
    expect(mapToApiError({ isAxiosError: true, config: { headers: {} } }).category).toBe('NETWORK_ERROR');
  });
});

// =============================================================================
// SHOULD RETRY TESTS
// =============================================================================
describe('shouldRetry()', () => {
  const base = { method: 'GET', retryCount: 0, maxRetries: 3 } as any;

  it('returns false when skipRetry=true', () => {
    expect(shouldRetry({ ...base, skipRetry: true })).toBe(false);
  });

  it('returns false when signal is aborted', () => {
    const ctrl = new AbortController();
    ctrl.abort();
    expect(shouldRetry({ ...base, signal: ctrl.signal })).toBe(false);
  });

  it('returns false when retryCount >= maxRetries', () => {
    expect(shouldRetry({ ...base, retryCount: 3, maxRetries: 3 })).toBe(false);
    expect(shouldRetry({ ...base, retryCount: 5, maxRetries: 3 })).toBe(false);
  });

  it('returns false for non-idempotent methods', () => {
    expect(shouldRetry({ ...base, method: 'POST' }, 500)).toBe(false);
    expect(shouldRetry({ ...base, method: 'PATCH' }, 500)).toBe(false);
  });

  it.each([400, 401, 403, 404, 409, 422, 429, 300, 301])(
    'returns false for non-retryable status %i', (status) => {
      expect(shouldRetry(base, status)).toBe(false);
    }
  );

  it.each([500, 502, 503, 504])(
    'returns true for server error status %i', (status) => {
      expect(shouldRetry(base, status)).toBe(true);
    }
  );

  it('returns true for network error (no status)', () => {
    expect(shouldRetry(base, undefined)).toBe(true);
    expect(shouldRetry(base)).toBe(true);
  });

  it('returns true when within retry boundary for idempotent method + server error', () => {
    expect(shouldRetry({ ...base, retryCount: 2, maxRetries: 3 }, 500)).toBe(true);
  });
});

// =============================================================================
// JITTER DELAY TESTS
// jitter.ts: result = floor(capped + random * capped * 0.5)
// Range: [capped, capped * 1.5)
// =============================================================================
describe('getJitterDelay()', () => {
  it('retryCount=1: capped=1000, result in [1000, 1499]', () => {
    for (let i = 0; i < 20; i++) {
      const d = getJitterDelay(1, 1000, 5000);
      expect(d).toBeGreaterThanOrEqual(1000);
      expect(d).toBeLessThan(1500);
    }
  });

  it('retryCount=2: capped=2000, result in [2000, 2999]', () => {
    for (let i = 0; i < 20; i++) {
      const d = getJitterDelay(2, 1000, 5000);
      expect(d).toBeGreaterThanOrEqual(2000);
      expect(d).toBeLessThan(3000);
    }
  });

  it('retryCount=4: capped=5000 (hit max), result in [5000, 7499]', () => {
    for (let i = 0; i < 20; i++) {
      const d = getJitterDelay(4, 1000, 5000);
      expect(d).toBeGreaterThanOrEqual(5000);
      expect(d).toBeLessThan(7500);
    }
  });

  it('never exceeds maxDelay * 1.5', () => {
    for (let i = 1; i <= 10; i++) {
      const d = getJitterDelay(i, 1000, 5000);
      expect(d).toBeLessThan(7500);
      expect(d).toBeGreaterThanOrEqual(0);
    }
  });
});

// =============================================================================
// REQUEST LOG TESTS
// requestLog.ts calls apiLogger.debug / apiLogger.warn / apiLogger.info
// These in turn call console.debug / console.warn / console.info with prefix
// =============================================================================
describe('requestLog utilities', () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy:  ReturnType<typeof vi.spyOn>;
  let infoSpy:  ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    warnSpy  = vi.spyOn(console, 'warn').mockImplementation(() => {});
    infoSpy  = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    debugSpy.mockRestore();
    warnSpy.mockRestore();
    infoSpy.mockRestore();
  });

  it('logRequest() calls console.debug with --> prefix', () => {
    const cfg = { url: '/test', method: 'get', headers: {}, correlationId: 'c1' } as any;
    logRequest(cfg);
    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy.mock.calls[0][0]).toMatch(/--> GET \/test \| CorrelationId: c1/);
  });

  it('logResponse() calls console.debug with <-- prefix and status/duration', () => {
    const cfg = { url: '/res', method: 'get', headers: {}, correlationId: 'c2' } as any;
    logResponse(cfg, 200, { data: 'ok' }, 55);
    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy.mock.calls[0][0]).toMatch(/<-- GET \/res \| Status: 200 \| Duration: 55ms/);
    expect(debugSpy.mock.calls[0][1]).toMatchObject({ payload: { data: 'ok' } });
  });

  it('logRetry() calls console.warn with [RETRY] prefix and single string arg', () => {
    const cfg = { url: '/retry', method: 'get', headers: {}, correlationId: 'c3' } as any;
    logRetry(cfg, 2, 'Timeout', 1500);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    // logRetry passes a SINGLE string to apiLogger.warn — check the whole message
    const [msg] = warnSpy.mock.calls[0];
    expect(msg).toMatch(/\[RETRY\] Attempt 2 for GET \/retry due to error: "Timeout"/);
    expect(msg).toMatch(/Retrying in 1500ms/);
  });

  it('logRefresh() calls console.info with [REFRESH_PIPELINE] prefix', () => {
    logRefresh('START');
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0][0]).toMatch(/\[REFRESH_PIPELINE\] Event: START/);
  });

  it('logRefresh() includes details when provided', () => {
    logRefresh('FAILURE', 'No token');
    const [msg] = infoSpy.mock.calls[0];
    expect(msg).toMatch(/\[REFRESH_PIPELINE\] Event: FAILURE \| Details: No token/);
  });
});

// =============================================================================
// ENDPOINT REGISTRY + DTO MAPPER TESTS
// =============================================================================
describe('API_ENDPOINTS registry', () => {
  it('USER.PROFILE is /user/profile', () => {
    expect(API_ENDPOINTS.USER.PROFILE).toBe('/user/profile');
  });

  it('ORGANIZATION.DETAILS(id) returns /organizations/:id', () => {
    expect(API_ENDPOINTS.ORGANIZATION.DETAILS('org-99')).toBe('/organizations/org-99');
  });
});

describe('mapResponseDto()', () => {
  it('applies transform function to data', () => {
    const result = mapResponseDto(
      { success: true, data: { user_name: 'Alice' } },
      (d) => ({ userName: d.user_name })
    );
    expect(result.data).toEqual({ userName: 'Alice' });
    expect(result.success).toBe(true);
  });

  it('handles null data', () => {
    const result = mapResponseDto({ success: true, data: null }, (d) => d);
    expect(result.data).toBeNull();
  });
});

// =============================================================================
// BASE SERVICE TESTS
// BaseService wraps Axios client — test all HTTP verb wrappers
// =============================================================================
describe('BaseService', () => {
  let client: any;
  let svc: BaseService;

  beforeEach(() => {
    client = {
      get:    vi.fn().mockResolvedValue({ data: 'got' }),
      post:   vi.fn().mockResolvedValue({ data: 'posted' }),
      put:    vi.fn().mockResolvedValue({ data: 'put' }),
      delete: vi.fn().mockResolvedValue({ data: 'deleted' }),
      patch:  vi.fn().mockResolvedValue({ data: 'patched' }),
    };
    svc = new BaseService(client);
  });

  it('get() returns response data', async () => {
    expect(await (svc as any).get('/x')).toBe('got');
    expect(client.get).toHaveBeenCalledWith('/x', undefined);
  });

  it('post() returns response data', async () => {
    expect(await (svc as any).post('/x', { a: 1 })).toBe('posted');
    expect(client.post).toHaveBeenCalledWith('/x', { a: 1 }, undefined);
  });

  it('put() returns response data', async () => {
    expect(await (svc as any).put('/x', { a: 2 })).toBe('put');
    expect(client.put).toHaveBeenCalledWith('/x', { a: 2 }, undefined);
  });

  it('delete() returns response data', async () => {
    expect(await (svc as any).delete('/x')).toBe('deleted');
    expect(client.delete).toHaveBeenCalledWith('/x', undefined);
  });

  it('patch() returns response data', async () => {
    expect(await (svc as any).patch('/x', { a: 3 })).toBe('patched');
    expect(client.patch).toHaveBeenCalledWith('/x', { a: 3 }, undefined);
  });
});
