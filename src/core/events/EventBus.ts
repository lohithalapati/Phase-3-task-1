export interface PlatformEvent<T = any> {
  id: string;
  type: string;
  timestamp: number;
  payload: T;
  source: string;
}

export type EventCallback<T = any> = (event: PlatformEvent<T>) => void;

class EventBusService {
  private static instance: EventBusService;
  private listeners: Map<string, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): EventBusService {
    if (!EventBusService.instance) {
      EventBusService.instance = new EventBusService();
    }
    return EventBusService.instance;
  }

  public publish<T>(type: string, payload: T, source: string): PlatformEvent<T> {
    const event: PlatformEvent<T> = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      type,
      timestamp: Date.now(),
      payload,
      source,
    };

    const targets = this.listeners.get(type);
    if (targets) {
      targets.forEach((callback) => {
        try {
          callback(event);
        } catch (err) {
          console.error(`[EventBus] Callback crash for event: ${type}`, err);
        }
      });
    }

    // Catch-all system-wide wildcard listeners
    const wildcardTargets = this.listeners.get("*");
    if (wildcardTargets) {
      wildcardTargets.forEach((callback) => {
        try {
          callback(event);
        } catch (err) {
          console.error(`[EventBus] Wildcard crash for event: ${type}`, err);
        }
      });
    }

    return event;
  }

  public subscribe<T>(type: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      const targets = this.listeners.get(type);
      if (targets) {
        targets.delete(callback);
        if (targets.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const EventBus = EventBusService.getInstance();

export const EventTypes = {
  SYSTEM_ERROR: "SYSTEM:ERROR",
  TELEMETRY_TRACKED: "TELEMETRY:TRACKED",
  NOTIFICATION_DISPATCH: "NOTIFICATION:DISPATCH",
  AUTH_EXPIRED: "AUTH:EXPIRED",
} as const;