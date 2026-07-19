export enum NotificationPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW",
}

export enum NotificationChannel {
  TOAST = "TOAST",
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
  SLACK = "SLACK",
  TEAMS = "TEAMS",
}

export enum NotificationState {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
  ACKNOWLEDGED = "ACKNOWLEDGED",
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  state: NotificationState;
  timestamp: number;
  metadata?: Record<string, any>;
  duration?: number;
}