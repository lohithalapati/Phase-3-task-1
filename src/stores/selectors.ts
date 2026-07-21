import { useAuthStore } from './authStore';
import { useUserStore } from './userStore';
import { useNotificationStore } from './notificationStore';
import { useOrgStore } from './orgStore';
import { useLoadingStore } from './loadingStore';
import { useSystemStore } from './systemStore';
import { useHydrationStore } from './hydrationStore';

export const useAuthSelectors = {
  useIsAuthenticated: () => useAuthStore((state) => state.isAuthenticated),
  useToken: () => useAuthStore((state) => state.accessToken),
  useUserId: () => useAuthStore((state) => state.userId),
};

export const useUserSelectors = {
  useProfile: () => useUserStore((state) => state.profile),
  usePreferences: () => useUserStore((state) => state.preferences),
  useLocale: () => useUserStore((state) => state.preferences.locale),
};

export const useOrgSelectors = {
  useCurrentOrg: () => useOrgStore((state) => state.currentOrg),
  useAvailableOrgs: () => useOrgStore((state) => state.availableOrgs),
};

export const useNotificationSelectors = {
  useActiveNotifications: () => useNotificationStore((state) => state.notifications),
};

export const useLoadingSelectors = {
  useIsKeyLoading: (key: string) => useLoadingStore((state) => !!state.loaders[key]),
};

export const useSystemSelectors = {
  useIsOnline: () => useSystemStore((state) => state.isOnline),
  useIsMaintenance: () => useSystemStore((state) => state.isMaintenanceMode),
  useFatalError: () => useSystemStore((state) => state.fatalError),
};

export const useHydrationSelectors = {
  useIsHydrated: (storeName: string) => useHydrationStore((state) => !!state.hydratedStores[storeName]),
  useAllHydrationComplete: () => useHydrationStore((state) => {
    const essentialStores = ['user', 'org', 'theme', 'settings'];
    return essentialStores.every((store) => state.hydratedStores[store]);
  }),
};
