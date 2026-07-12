export interface MetricsReport {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalRetries: number;
  totalRefreshes: number;
  averageLatencyMs: number;
}

class MetricsCollector {
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalRetries = 0;
  private totalRefreshes = 0;
  private latencyRecords: number[] = [];

  trackRequest() {
    this.totalRequests++;
  }

  trackSuccess(latencyMs: number) {
    this.successfulRequests++;
    this.latencyRecords.push(latencyMs);
  }

  trackFailure() {
    this.failedRequests++;
  }

  trackRetry() {
    this.totalRetries++;
  }

  trackRefresh() {
    this.totalRefreshes++;
  }

  getReport(): MetricsReport {
    const sum = this.latencyRecords.reduce((a, b) => a + b, 0);
    const averageLatencyMs = this.latencyRecords.length > 0 ? sum / this.latencyRecords.length : 0;
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      totalRetries: this.totalRetries,
      totalRefreshes: this.totalRefreshes,
      averageLatencyMs
    };
  }

  clear() {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalRetries = 0;
    this.totalRefreshes = 0;
    this.latencyRecords = [];
  }
}

export const metricsCollector = new MetricsCollector();