import { AuditPayload } from './types';
import { EventBus } from '../mocks/EventBus';

export class AuditLogger {
  static logSecurityEvent(action: string, userId?: string, details: Record<string, any> = {}): void {
    const payload: AuditPayload = {
      eventId: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'simulated-uuid-token',
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'NodeServer'
    };

    EventBus.publish('SECURITY_AUDIT_LOGGED', payload);
  }
}
