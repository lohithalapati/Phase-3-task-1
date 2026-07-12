export interface PerformanceMetricsReport {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalRetries: number;
  totalRefreshes: number;
  averageLatencyMs: number;
}

class PerformanceMetricsCollector {
  private totalRequests = 0;
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalRetries = 0;
  private totalRefreshes = 0;
  private latencyHistoryMs: number[] = [];

  public trackRequest(): void {
    this.totalRequests++;
  }

  public trackSuccess(latencyMs?: number): void {
    this.successfulRequests++;
    if (latencyMs !== undefined) {
      this.latencyHistoryMs.push(latencyMs);
    }
  }

  public trackFailure(): void {
    this.failedRequests++;
  }

  public trackRetry(): void {
    this.totalRetries++;
  }

  public trackRefresh(): void {
    this.totalRefreshes++;
  }

  public getAverageLatency(): number {
    if (this.latencyHistoryMs.length === 0) return 0;
    const sum = this.latencyHistoryMs.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / this.latencyHistoryMs.length);
  }

  public getReport(): PerformanceMetricsReport {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      totalRetries: this.totalRetries,
      totalRefreshes: this.totalRefreshes,
      averageLatencyMs: this.getAverageLatency(),
    };
  }

  public clear(): void {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalRetries = 0;
    this.totalRefreshes = 0;
    this.latencyHistoryMs = [];
  }
}

export const metricsCollector = new PerformanceMetricsCollector();