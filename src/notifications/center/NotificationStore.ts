import { useState, useEffect } from "react";
import { NotificationItem, NotificationState } from "../types/Notification";
import { NotificationPriorityQueue } from "../queue/PriorityQueue";

type StoreListener = () => void;

class CentralNotificationStore {
  private items: NotificationItem[] = [];
  private queue: NotificationPriorityQueue = new NotificationPriorityQueue();
  private listeners: Set<StoreListener> = new Set();

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("[NotificationStore] Listener invocation failed", err);
      }
    });
  }

  public add(item: NotificationItem): void {
    this.items.unshift(item);
    this.queue.enqueue(item);
    this.emit();
  }

  public getState() {
    return {
      items: this.items,
      unreadCount: this.items.filter((i) => i.state === NotificationState.UNREAD).length,
      queue: this.queue.getAll(),
    };
  }

  public updateState(id: string, state: NotificationState): void {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.state = state;
      this.emit();
    }
  }

  public markAllAsRead(): void {
    this.items.forEach((item) => {
      if (item.state === NotificationState.UNREAD) {
        item.state = NotificationState.READ;
      }
    });
    this.emit();
  }

  public clearAll(): void {
    this.items = [];
    this.queue.clear();
    this.emit();
  }

  public remove(id: string): void {
    this.items = this.items.filter((i) => i.id !== id);
    this.queue.clear();
    this.items.forEach((item) => this.queue.enqueue(item));
    this.emit();
  }
}

export const notificationStore = new CentralNotificationStore();

export function useNotificationStore() {
  const [state, setState] = useState(notificationStore.getState());

  useEffect(() => {
    return notificationStore.subscribe(() => {
      setState(notificationStore.getState());
    });
  }, []);

  return {
    ...state,
    updateState: (id: string, state: NotificationState) => notificationStore.updateState(id, state),
    markAllAsRead: () => notificationStore.markAllAsRead(),
    clearAll: () => notificationStore.clearAll(),
    remove: (id: string) => notificationStore.remove(id),
  };
}