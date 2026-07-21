import { createEnterpriseStore } from './storeFactory';
import { SystemState } from './types';
import { storeEventBus } from './storeEventBus';

export const useSystemStore = createEnterpriseStore<SystemState>(
  (set) => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isMaintenanceMode: false,
    fatalError: null,
    offlineQueue: [],
    setOnlineStatus: (isOnline) => {
      set({ isOnline }, false, 'system/setOnlineStatus');
      storeEventBus.publish('NETWORK_STATE_CHANGED', { isOnline });
    },
    setMaintenanceMode: (isMaintenanceMode) => set({ isMaintenanceMode }, false, 'system/setMaintenanceMode'),
    setFatalError: (fatalError) => set({ fatalError }, false, 'system/setFatalError'),
    enqueueOfflineAction: (actionType, payload) =>
      set(
        (state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            { id: Math.random().toString(36).substring(2, 9), timestamp: Date.now(), actionType, payload },
          ],
        }),
        false,
        'system/enqueueOffline'
      ),
    clearOfflineQueue: () => set({ offlineQueue: [] }, false, 'system/clearOfflineQueue'),
  }),
  {
    name: 'system',
    persistType: 'none',
    enableSync: true,
  }
);

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useSystemStore.getState().setOnlineStatus(true));
  window.addEventListener('offline', () => useSystemStore.getState().setOnlineStatus(false));
}
