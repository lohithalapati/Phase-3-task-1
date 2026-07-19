import React, { useEffect, useRef } from "react";
import { useNotificationStore } from "./NotificationStore";
import { NotificationState, NotificationItem } from "../types/Notification";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { items, updateState, markAllAsRead, clearAll, remove } = useNotificationStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      drawerRef.current?.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-150 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Notification Central
            </h3>
            {items.some((i) => i.state === NotificationState.UNREAD) && (
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-500 font-semibold"
            >
              Mark All Read
            </button>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <p className="text-sm">Inbox cleared and quiet.</p>
            </div>
          ) : (
            items.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onRead={() => updateState(item.id, NotificationState.READ)}
                onArchive={() => updateState(item.id, NotificationState.ARCHIVED)}
                onRemove={() => remove(item.id)}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-150 dark:border-gray-800">
            <button
              onClick={clearAll}
              className="w-full py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-700 dark:text-rose-400 font-semibold rounded-lg text-xs tracking-wider transition-colors"
            >
              PURGE NOTIFICATION CACHE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface NotificationCardProps {
  item: NotificationItem;
  onRead: () => void;
  onArchive: () => void;
  onRemove: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ item, onRead, onArchive, onRemove }) => {
  const isUnread = item.state === NotificationState.UNREAD;

  return (
    <div
      className={`p-3.5 rounded-lg border transition-all relative ${
        isUnread
          ? "bg-slate-50 dark:bg-slate-900 border-indigo-200/50 dark:border-indigo-950"
          : "bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800 opacity-70"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {item.title}
        </h4>
        <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${
          item.priority === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
        }`}>
          {item.priority}
        </span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
        {item.message}
      </p>

      <div className="flex justify-end gap-2 mt-3 text-[10px] font-bold tracking-wide border-t border-gray-100 dark:border-gray-850 pt-2.5">
        {isUnread && (
          <button onClick={onRead} className="text-blue-600 hover:text-blue-500">
            Mark Read
          </button>
        )}
        {item.state !== NotificationState.ARCHIVED && (
          <button onClick={onArchive} className="text-gray-500 hover:text-gray-400">
            Archive
          </button>
        )}
        <button onClick={onRemove} className="text-rose-600 hover:text-rose-500">
          Delete
        </button>
      </div>
    </div>
  );
};