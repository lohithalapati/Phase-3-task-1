import { metricStore } from './counters';

export const apiMetrics = {
  incrementRequests(): void {
    metricStore.requests += 1;
  },

  incrementSuccesses(): void {
    metricStore.successes += 1;
  },

  incrementFailures(): void {
    metricStore.failures += 1;
  },

  incrementRetries(): void {
    metricStore.retries += 1;
  },

  incrementRefreshes(): void {
    metricStore.refreshes += 1;
  },

  trackLatency(durationMs: number): void {
    metricStore.totalLatencyMs += durationMs;
  },

  getSnapshot() {
    return {
      ...metricStore,
      averageLatencyMs: metricStore.requests > 0 ? metricStore.totalLatencyMs / metricStore.requests : 0,
    };
  },

  reset(): void {
    metricStore.requests = 0;
    metricStore.successes = 0;
    metricStore.failures = 0;
    metricStore.retries = 0;
    metricStore.refreshes = 0;
    metricStore.totalLatencyMs = 0;
  }
};
