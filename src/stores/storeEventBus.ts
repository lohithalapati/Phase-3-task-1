export type StoreEventType = 
  | 'AUTH_LOGOUT' 
  | 'SESSION_EXPIRED' 
  | 'WORKSPACE_CHANGED' 
  | 'SETTINGS_RESET'
  | 'NETWORK_STATE_CHANGED';

export type StoreEventCallback = (payload?: any) => void;

class StoreEventBus {
  private listeners = new Map<StoreEventType, Set<StoreEventCallback>>();

  public subscribe(event: StoreEventType, callback: StoreEventCallback): () => void {
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

  public publish(event: StoreEventType, payload?: any): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (error) {
          console.error(`Error in event handler for [${event}]:`, error);
        }
      });
    }
  }
}

export const storeEventBus = new StoreEventBus();
