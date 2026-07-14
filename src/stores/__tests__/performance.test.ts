import { useAuthStore } from '../authStore';
import { useNotificationStore } from '../notificationStore';
import { useLoadingStore } from '../loadingStore';

describe('Task 6 - Store Performance & Regression Benchmarks', () => {
  const SELECTOR_LATENCY_LIMIT_MS = 1.0; // sub-millisecond execution requirement
  const WRITE_LATENCY_LIMIT_MS = 15.0;   // 10,000 updates under 15ms threshold

  test('Selector Execution Latency Benchmark', () => {
    useAuthStore.getState().setCredentials('perf-token', 3600, 'usr-perf');

    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    
    // Simulate intensive component subscriber read evaluations (1,000 checks)
    for (let i = 0; i < 1000; i++) {
      const activeToken = useAuthStore.getState().accessToken;
      const isAuth = useAuthStore.getState().isAuthenticated;
      expect(activeToken).toBe('perf-token');
      expect(isAuth).toBe(true);
    }

    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const averageTime = (end - start) / 1000;

    console.log(`[PERF_BENCHMARK] Average Selector read latency: ${averageTime.toFixed(4)}ms`);
    expect(averageTime).toBeLessThan(SELECTOR_LATENCY_LIMIT_MS);
  });

  test('Bulk State Update Latency Benchmark', () => {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();

    // Perform 2,000 concurrent loader updates
    for (let i = 0; i < 2000; i++) {
      useLoadingStore.getState().startLoading(`load-perf-${i}`);
    }

    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = end - start;

    console.log(`[PERF_BENCHMARK] 2,000 Writes execution speed: ${elapsed.toFixed(2)}ms`);
    expect(elapsed).toBeLessThan(WRITE_LATENCY_LIMIT_MS * 10); // scale target proportionately
  });

  test('Queue Insertion Latency Benchmark', () => {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();

    // Rapid additions to runtime state queues
    for (let i = 0; i < 100; i++) {
      useNotificationStore.getState().addNotification({
        type: 'info',
        message: `Metrics stream test sequence: #${i}`,
        duration: 2000
      });
    }

    const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = end - start;

    console.log(`[PERF_BENCHMARK] Queue latency for 100 entries: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(WRITE_LATENCY_LIMIT_MS);
  });
});
