import React, { useEffect, useState } from "react";
import { useNotificationStore } from "../center/NotificationStore";
import { NotificationChannel, NotificationItem, NotificationPriority, NotificationState } from "../types/Notification";

export const ToastHost: React.FC = () => {
  const { items, updateState } = useNotificationStore();
  const [activeToasts, setActiveToasts] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const toasts = items.filter(
      (item) =>
        item.channels.includes(NotificationChannel.TOAST) &&
        item.state === NotificationState.UNREAD
    );
    setActiveToasts(toasts);
  }, [items]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full outline-none"
    >
      {activeToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => updateState(toast.id, NotificationState.READ)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: NotificationItem;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timeout = toast.duration || (toast.priority === NotificationPriority.CRITICAL ? 10000 : 5000);
    const timer = setTimeout(() => {
      onDismiss();
    }, timeout);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const priorityStyles = {
    [NotificationPriority.CRITICAL]: "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100",
    [NotificationPriority.HIGH]: "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100",
    [NotificationPriority.NORMAL]: "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100",
    [NotificationPriority.LOW]: "border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100",
  };

  return (
    <div
      role="status"
      className={`p-4 rounded-lg shadow-lg border border-gray-250/20 dark:border-gray-800 flex items-start gap-3 transform translate-y-0 transition-transform duration-300 ${priorityStyles[toast.priority]}`}
    >
      <div className="flex-1">
        <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">{toast.title}</h4>
        <p className="text-sm font-medium leading-normal opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss Notification"
        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg leading-none"
      >
        &times;
      </button>
    </div>
  );
};