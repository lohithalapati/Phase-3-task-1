export interface MetricStore {
  requests: number;
  successes: number;
  failures: number;
  retries: number;
  refreshes: number;
  totalLatencyMs: number;
}

export const metricStore: MetricStore = {
  requests: 0,
  successes: 0,
  failures: 0,
  retries: 0,
  refreshes: 0,
  totalLatencyMs: 0,
};
