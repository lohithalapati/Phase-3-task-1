// src/health/__tests__/HealthCheck.test.ts

import { HealthCheckService } from '../HealthCheck';

describe('HealthCheckService', () => {
  let service: HealthCheckService;

  beforeEach(() => {
    service = new HealthCheckService('1.0.0');
  });

  describe('getHealth', () => {
    it('should return healthy status', async () => {
      const health = await service.getHealth();
      expect(health.status).toBeDefined();
      expect(health.timestamp).toBeDefined();
      expect(health.uptime).toBeGreaterThanOrEqual(0);
      expect(health.version).toBe('1.0.0');
    });

    it('should include memory check', async () => {
      const health = await service.getHealth();
      expect(health.checks.memory).toBeDefined();
      expect(health.checks.memory.heapUsed).toBeGreaterThan(0);
      expect(health.checks.memory.heapTotal).toBeGreaterThan(0);
      expect(health.checks.memory.percentage).toBeGreaterThan(0);
    });

    it('should include performance check', async () => {
      const health = await service.getHealth();
      expect(health.checks.performance).toBeDefined();
      expect(health.checks.performance.responseTime).toBeGreaterThanOrEqual(0);
    });

    it('should return valid status values', async () => {
      const health = await service.getHealth();
      const validStatuses = ['healthy', 'degraded', 'unhealthy'];
      expect(validStatuses).toContain(health.status);
    });
  });
});
