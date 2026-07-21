export interface EventContractMap {
  AUTH_LOGIN: { userId: string; timestamp: number };
  AUTH_LOGOUT: { userId: string | null; timestamp: number };
  SESSION_EXPIRED: { expiredAt: number };
  WORKSPACE_CHANGED: { orgId: string; slug: string; roleInOrg: string };
  SETTINGS_RESET: undefined;
  NETWORK_STATE_CHANGED: { isOnline: boolean };
}

export interface EventMetadata {
  producer: string;
  consumers: string[];
}

export const EVENT_CONTRACTS: Record<keyof EventContractMap, EventMetadata> = {
  AUTH_LOGIN: {
    producer: 'AuthStore',
    consumers: ['UserStore', 'OrgStore', 'Session-dependent UI'],
  },
  AUTH_LOGOUT: {
    producer: 'AuthStore',
    consumers: ['UserStore', 'OrgStore', 'GlobalRouter'],
  },
  SESSION_EXPIRED: {
    producer: 'AuthStore',
    consumers: ['GlobalRouter', 'NotificationStore'],
  },
  WORKSPACE_CHANGED: {
    producer: 'OrgStore',
    consumers: ['PermissionStore', 'DataFetchingService'],
  },
  SETTINGS_RESET: {
    producer: 'SettingsStore',
    consumers: ['ThemeStore', 'UserPreferences'],
  },
  NETWORK_STATE_CHANGED: {
    producer: 'SystemStore',
    consumers: ['OfflineQueueProcessor', 'SyncService'],
  },
};

export type StoreEventCallback<K extends keyof EventContractMap> = (payload: EventContractMap[K]) => void;

class StoreEventBus {
  private listeners = new Map<keyof EventContractMap, Set<StoreEventCallback<any>>>();

  public subscribe<K extends keyof EventContractMap>(
    event: K,
    callback: StoreEventCallback<K>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const set = this.listeners.get(event);
      if (set) {
        set.delete(callback);
      }
    };
  }

  public publish<K extends keyof EventContractMap>(event: K, payload: EventContractMap[K]): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (error) {
          console.error(`[EVENT_BUS] Error in consumer handling [${event}]:`, error);
        }
      });
    }
  }
}

export const storeEventBus = new StoreEventBus();
