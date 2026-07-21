// ===========================================================================
// EventBus — Core Event-Driven Communication Layer
// NeuralHandoff V5 — Phase 3 Batch 2
// ===========================================================================

export type EventCallback<T = any> = (payload: T) => void;

// ---------------------------------------------------------------------------
// Event Types Registry (Versioned)
// ---------------------------------------------------------------------------
export const EventTypes = {
  SYSTEM_ERROR:            'system.error.v1',
  NOTIFICATION_DISPATCH:   'notification.dispatch.v1',
  AUDIT_ACTION:            'audit.action.v1',
  AUTH_LOGOUT:             'auth.logout.v1',
  AUTH_SESSION_EXPIRED:    'auth.session.expired.v1',
  AUTH_EXPIRED:            'auth.expired.v1',
  DOMAIN_EVENT:            'domain.event.v1',
  TELEMETRY_TRACKED:       'telemetry.tracked.v1'
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];

// ---------------------------------------------------------------------------
// Platform Event Envelope
// ---------------------------------------------------------------------------
export interface PlatformEvent<T = any> {
  id: string;
  type: EventType | string;
  payload: T;
  source?: string;
  timestamp: number;
  version: string;
}

// ---------------------------------------------------------------------------
// IEventBus Interface
// ---------------------------------------------------------------------------
export interface IEventBus {
  publish<T>(type: string, payload: T, source?: string): void;
  subscribe<T>(type: string, callback: (payload: T) => void): () => void;
  clear(): void;
}

// ---------------------------------------------------------------------------
// EventBusImpl — Singleton Implementation
// ---------------------------------------------------------------------------
export class EventBusImpl implements IEventBus {
  private listeners = new Map<string, Array<EventCallback<any>>>();

  public publish<T>(type: string, payload: T, source?: string): void {
    const callbacks = this.listeners.get(type) || [];
    callbacks.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error('[EventBus] Callback crash for event:', type, 'source:', source, err);
      }
    });
  }

  public subscribe<T>(type: string, callback: (payload: T) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback as EventCallback<any>);

    return () => {
      const existing = this.listeners.get(type) || [];
      this.listeners.set(type, existing.filter(cb => cb !== callback));
    };
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const EventBus = new EventBusImpl();