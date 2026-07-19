import { EventBus, EventTypes, PlatformEvent } from "../../core/events/EventBus";
import { AppError } from "../../errors/types/AppError";
import { NotificationChannel, NotificationItem, NotificationPriority, NotificationState } from "../types/Notification";
import { ChannelRouter } from "../channels/ChannelRouter";

class CoreNotificationPipeline {
  private static instance: CoreNotificationPipeline;

  private constructor() {}

  public static getInstance(): CoreNotificationPipeline {
    if (!CoreNotificationPipeline.instance) {
      CoreNotificationPipeline.instance = new CoreNotificationPipeline();
    }
    return CoreNotificationPipeline.instance;
  }

  public initialize(): void {
    // Explicitly pass generic types to avoid fallback to PlatformEvent<unknown>
    EventBus.subscribe<{ error: AppError; recovered: boolean }>(
      EventTypes.SYSTEM_ERROR, 
      (event) => this.handleSystemError(event)
    );
    
    EventBus.subscribe<Partial<NotificationItem>>(
      EventTypes.NOTIFICATION_DISPATCH, 
      (event) => this.handleDirectDispatch(event)
    );
  }

  private handleSystemError(event: PlatformEvent<{ error: AppError; recovered: boolean }>): void {
    const { error, recovered } = event.payload;

    const notification: NotificationItem = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      title: `System Alert: ${error.code}`,
      message: error.message,
      priority: error.kind === "FATAL" ? NotificationPriority.CRITICAL : NotificationPriority.HIGH,
      channels: [NotificationChannel.TOAST, NotificationChannel.IN_APP],
      state: NotificationState.UNREAD,
      timestamp: Date.now(),
      metadata: { source: event.source, recovered },
    };

    ChannelRouter.route(notification);
  }

  private handleDirectDispatch(event: PlatformEvent<Partial<NotificationItem>>): void {
    const raw = event.payload;

    const notification: NotificationItem = {
      id: raw.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)),
      title: raw.title || "Message Update",
      message: raw.message || "",
      priority: raw.priority || NotificationPriority.NORMAL,
      channels: raw.channels || [NotificationChannel.TOAST, NotificationChannel.IN_APP],
      state: raw.state || NotificationState.UNREAD,
      timestamp: Date.now(),
      metadata: raw.metadata,
      duration: raw.duration,
    };

    ChannelRouter.route(notification);
  }
}

export const NotificationPipeline = CoreNotificationPipeline.getInstance();