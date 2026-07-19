import { NotificationItem, NotificationPriority } from "../types/Notification";

const PriorityWeight: Record<NotificationPriority, number> = {
  [NotificationPriority.CRITICAL]: 4,
  [NotificationPriority.HIGH]: 3,
  [NotificationPriority.NORMAL]: 2,
  [NotificationPriority.LOW]: 1,
};

export class NotificationPriorityQueue {
  private items: NotificationItem[] = [];

  public enqueue(item: NotificationItem): void {
    this.items.push(item);
    this.sort();
  }

  public dequeue(): NotificationItem | undefined {
    return this.items.shift();
  }

  public peek(): NotificationItem | undefined {
    return this.items[0];
  }

  public size(): number {
    return this.items.length;
  }

  public getAll(): NotificationItem[] {
    return [...this.items];
  }

  public clear(): void {
    this.items = [];
  }

  private sort(): void {
    this.items.sort((a, b) => {
      const weightA = PriorityWeight[a.priority];
      const weightB = PriorityWeight[b.priority];

      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return b.timestamp - a.timestamp;
    });
  }
}