// src/health/HealthCheck.ts

import { performance } from 'perf_hooks';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    memory: MemoryCheck;
    performance: PerformanceCheck;
  };
}

interface MemoryCheck {
  status: 'ok' | 'warning' | 'critical';
  heapUsed: number;
  heapTotal: number;
  percentage: number;
}

interface PerformanceCheck {
  status: 'ok' | 'warning' | 'critical';
  responseTime: number;
}

export class HealthCheckService {
  private readonly startTime: number;
  private readonly version: string;

  constructor(version: string = '1.0.0') {
    this.startTime = Date.now();
    this.version = version;
  }

  async getHealth(): Promise<HealthStatus> {
    const memoryCheck = this.checkMemory();
    const performanceCheck = await this.checkPerformance();
    const overallStatus = this.determineOverallStatus([
      memoryCheck.status,
      performanceCheck.status
    ]);
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      version: this.version,
      checks: { memory: memoryCheck, performance: performanceCheck }
    };
  }

  private checkMemory(): MemoryCheck {
    const memUsage = process.memoryUsage();
    const percentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    return {
      status: percentage > 90 ? 'critical' : percentage > 70 ? 'warning' : 'ok',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round(percentage)
    };
  }

  private async checkPerformance(): Promise<PerformanceCheck> {
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 1));
    const responseTime = performance.now() - start;
    return {
      status: responseTime > 100 ? 'critical' : responseTime > 50 ? 'warning' : 'ok',
      responseTime: Math.round(responseTime)
    };
  }

  private determineOverallStatus(
    statuses: Array<'ok' | 'warning' | 'critical'>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    if (statuses.includes('critical')) return 'unhealthy';
    if (statuses.includes('warning')) return 'degraded';
    return 'healthy';
  }
}
