type EventCallback = (payload: any) => void;

class SystemEventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    return () => {
      const list = this.listeners.get(event) || [];
      this.listeners.set(event, list.filter(cb => cb !== callback));
    };
  }

  publish(event: string, payload: any): void {
    const list = this.listeners.get(event) || [];
    list.forEach(callback => {
      try {
        callback(payload);
      } catch (err) {
        // Safe isolation
      }
    });
  }
}

export const EventBus = new SystemEventBus();
