import { createEnterpriseStore } from './storeFactory';
import { NotificationState } from './types';

export const useNotificationStore = createEnterpriseStore<NotificationState>(
  (set) => ({
    notifications: [],
    addNotification: (notification) => {
      const id = Math.random().toString(36).substring(2, 9);
      set(
        (state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }),
        false,
        'notification/add'
      );
      return id;
    },
    removeNotification: (id) =>
      set(
        (state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }),
        false,
        'notification/remove'
      ),
    clearNotifications: () =>
      set({ notifications: [] }, false, 'notification/clearAll'),
  }),
  {
    name: 'notification',
    persistType: 'none',
  }
);
