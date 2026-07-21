import { NotificationItem, NotificationChannel } from "../types/Notification";
import { notificationStore } from "../center/NotificationStore";

export interface IChannelAdapter {
  send(item: NotificationItem): Promise<boolean>;
}

export class ToastChannelAdapter implements IChannelAdapter {
  public async send(item: NotificationItem): Promise<boolean> {
    notificationStore.add(item);
    return true;
  }
}

export class InAppChannelAdapter implements IChannelAdapter {
  public async send(item: NotificationItem): Promise<boolean> {
    notificationStore.add(item);
    return true;
  }
}

export class ExternalMockChannelAdapter implements IChannelAdapter {
  constructor(private channelName: string) {}
  public async send(item: NotificationItem): Promise<boolean> {
    console.info(`[ChannelRouter] Routing notification to mock adapter: ${this.channelName}`, item);
    return true;
  }
}

class ChannelDispatcher {
  private static instance: ChannelDispatcher;
  private adapters: Map<NotificationChannel, IChannelAdapter> = new Map();

  private constructor() {
    this.registerAdapter(NotificationChannel.TOAST, new ToastChannelAdapter());
    this.registerAdapter(NotificationChannel.IN_APP, new InAppChannelAdapter());
    this.registerAdapter(NotificationChannel.EMAIL, new ExternalMockChannelAdapter("Email"));
    this.registerAdapter(NotificationChannel.SMS, new ExternalMockChannelAdapter("SMS"));
    this.registerAdapter(NotificationChannel.PUSH, new ExternalMockChannelAdapter("Push"));
    this.registerAdapter(NotificationChannel.SLACK, new ExternalMockChannelAdapter("Slack"));
    this.registerAdapter(NotificationChannel.TEAMS, new ExternalMockChannelAdapter("Teams"));
  }

  public static getInstance(): ChannelDispatcher {
    if (!ChannelDispatcher.instance) {
      ChannelDispatcher.instance = new ChannelDispatcher();
    }
    return ChannelDispatcher.instance;
  }

  public registerAdapter(channel: NotificationChannel, adapter: IChannelAdapter): void {
    this.adapters.set(channel, adapter);
  }

  public async route(item: NotificationItem): Promise<void> {
    for (const channel of item.channels) {
      const adapter = this.adapters.get(channel);
      if (adapter) {
        try {
          await adapter.send(item);
        } catch (err) {
          console.error(`[ChannelRouter] Routing crash to channel: ${channel}`, err);
        }
      }
    }
  }
}

export const ChannelRouter = ChannelDispatcher.getInstance();