import { EventBus, EventTypes } from '../../core/events/EventBus';
import { AppError } from '../../errors/types/AppError';
import { NotificationItem } from '../types/Notification';

export class NotificationPipeline {
  private static unsubscribers: Array<() => void> = [];

  static initialize(): void {
    // Subscribe to system errors (payload is AppError directly)
    const unsubError = EventBus.subscribe<AppError>(
      EventTypes.SYSTEM_ERROR,
      (error) => NotificationPipeline.handleSystemError(error)
    );

    // Subscribe to direct notification dispatches
    const unsubNotif = EventBus.subscribe<Partial<NotificationItem>>(
      EventTypes.NOTIFICATION_DISPATCH,
      (item) => NotificationPipeline.handleDirectDispatch(item)
    );

    NotificationPipeline.unsubscribers.push(unsubError, unsubNotif);
  }

  static destroy(): void {
    NotificationPipeline.unsubscribers.forEach(unsub => unsub());
    NotificationPipeline.unsubscribers = [];
  }

  private static handleSystemError(error: AppError): void {
    console.info('[NotificationPipeline] System error received:', error.message);
  }

  private static handleDirectDispatch(item: Partial<NotificationItem>): void {
    console.info('[NotificationPipeline] Direct dispatch received:', item.title);
  }
}