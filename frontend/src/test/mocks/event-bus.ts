import { vi } from 'vitest';

type Listener<T = unknown> = (payload: T) => void;

export class MockEventBus {
  private listeners = new Map<string, Set<Listener>>();

  emit = vi.fn(<T>(event: string, payload: T): void => {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  });

  on = vi.fn(<T>(event: string, listener: Listener<T>): (() => void) => {
    const listeners = this.listeners.get(event) ?? new Set<Listener>();
    listeners.add(listener as Listener);
    this.listeners.set(event, listeners);
    return () => this.off(event, listener as Listener);
  });

  off = vi.fn((event: string, listener: Listener): void => {
    this.listeners.get(event)?.delete(listener);
  });

  reset(): void {
    this.listeners.clear();
    this.emit.mockClear();
    this.on.mockClear();
    this.off.mockClear();
  }
}

export const mockEventBus = new MockEventBus();
