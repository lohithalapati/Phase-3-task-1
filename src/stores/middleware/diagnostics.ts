export interface DiagnosticMetrics {
  storeName: string;
  actionCount: number;
  hydrationTimeMs?: number;
  lastUpdateTime?: number;
  stateSizeEstimateBytes: number;
}

class StoreDiagnostics {
  private metrics = new Map<string, DiagnosticMetrics>();

  public recordHydration(storeName: string, durationMs: number): void {
    const current = this.getOrCreate(storeName);
    current.hydrationTimeMs = durationMs;
    this.metrics.set(storeName, current);
    this.logMetric(`Store [${storeName}] Hydrated in ${durationMs.toFixed(2)}ms`);
  }

  public recordUpdate(storeName: string, state: any): void {
    const current = this.getOrCreate(storeName);
    current.actionCount++;
    current.lastUpdateTime = Date.now();
    try {
      current.stateSizeEstimateBytes = JSON.stringify(state).length * 2; // Rough UTF-16 representation
    } catch {
      // Handle potential self-referential structures safely
    }
    this.metrics.set(storeName, current);
  }

  public getMetrics(): DiagnosticMetrics[] {
    return Array.from(this.metrics.values());
  }

  private getOrCreate(storeName: string): DiagnosticMetrics {
    return this.metrics.get(storeName) || {
      storeName,
      actionCount: 0,
      stateSizeEstimateBytes: 0,
    };
  }

  private logMetric(message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`%c[STATE METRICS] ${message}`, 'color: #10b981; font-weight: bold;');
    }
  }
}

export const storeDiagnostics = new StoreDiagnostics();
