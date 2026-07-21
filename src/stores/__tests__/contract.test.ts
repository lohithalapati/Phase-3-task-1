import { useAuthStore } from '../authStore';
import { useUserStore } from '../userStore';
import { useOrgStore } from '../orgStore';
import { useThemeStore } from '../themeStore';
import { useSidebarStore } from '../sidebarStore';
import { useNotificationStore } from '../notificationStore';
import { useLoadingStore } from '../loadingStore';
import { useSettingsStore } from '../settingsStore';
import { useSystemStore } from '../systemStore';
import { useHydrationStore } from '../hydrationStore';
import { resetCoreSessionStores } from '../resetOrchestrator';

describe('Task 6 - Store Public Contract Specifications', () => {
  beforeEach(() => {
    useAuthStore.getState().clearCredentials();
    useUserStore.getState().clearUser();
    useOrgStore.getState().clearOrg();
    useThemeStore.getState().setTheme('system');
    useSidebarStore.getState().setSidebarOpen(true);
    useSidebarStore.getState().setSidebarCollapsed(false);
    useNotificationStore.getState().clearNotifications();
    useSettingsStore.getState().resetSettings();
    useSystemStore.getState().clearOfflineQueue();
  });

  test('AuthStore Contract verification', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.userId).toBeNull();

    state.setCredentials('sample-token', 5000, 'usr-99');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe('sample-token');

    useAuthStore.getState().clearCredentials();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  test('UserStore Contract verification', () => {
    const state = useUserStore.getState();
    expect(state.profile).toBeNull();
    expect(state.preferences.locale).toBe('en');

    state.setProfile({ id: '1', email: 'test@corp.com', firstName: 'A', lastName: 'B', roles: [] });
    expect(useUserStore.getState().profile?.email).toBe('test@corp.com');

    state.updatePreferences({ locale: 'de' });
    expect(useUserStore.getState().preferences.locale).toBe('de');
  });

  test('OrgStore Contract verification', () => {
    const state = useOrgStore.getState();
    expect(state.currentOrg).toBeNull();
    expect(state.availableOrgs).toEqual([]);

    state.setCurrentOrg({ id: 'o1', name: 'Alpha', slug: 'alpha', roleInOrg: 'Owner' });
    expect(useOrgStore.getState().currentOrg?.name).toBe('Alpha');
  });

  test('ThemeStore Contract verification', () => {
    expect(useThemeStore.getState().theme).toBe('system');
    useThemeStore.getState().setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  test('SidebarStore Contract verification', () => {
    expect(useSidebarStore.getState().isOpen).toBe(true);
    useSidebarStore.getState().toggleSidebar();
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  test('NotificationStore Contract verification', () => {
    expect(useNotificationStore.getState().notifications.length).toBe(0);
    const id = useNotificationStore.getState().addNotification({ type: 'success', message: 'Ready' });
    expect(useNotificationStore.getState().notifications.length).toBe(1);
    expect(useNotificationStore.getState().notifications[0].id).toBe(id);

    useNotificationStore.getState().removeNotification(id);
    expect(useNotificationStore.getState().notifications.length).toBe(0);
  });

  test('LoadingStore Contract verification', () => {
    const key = 'fetch-assets';
    expect(useLoadingStore.getState().isLoading(key)).toBe(false);
    useLoadingStore.getState().startLoading(key);
    expect(useLoadingStore.getState().isLoading(key)).toBe(true);
    useLoadingStore.getState().stopLoading(key);
    expect(useLoadingStore.getState().isLoading(key)).toBe(false);
  });

  test('SystemStore Contract verification', () => {
    const state = useSystemStore.getState();
    expect(state.isOnline).toBe(true);
    expect(state.isMaintenanceMode).toBe(false);
    expect(state.offlineQueue).toEqual([]);

    state.enqueueOfflineAction('POST_ASSET', { id: 'x' });
    expect(useSystemStore.getState().offlineQueue.length).toBe(1);
  });

  test('HydrationStore Contract verification', () => {
    const state = useHydrationStore.getState();
    expect(state.isStoreHydrated('user')).toBe(false);
    state.setStoreHydrated('user');
    expect(useHydrationStore.getState().isStoreHydrated('user')).toBe(true);
  });

  test('Session Resets synchronicity', () => {
    useAuthStore.getState().setCredentials('a', 1, 'b');
    useUserStore.getState().setProfile({ id: '1', email: 'e', firstName: 'a', lastName: 'b', roles: [] });
    useOrgStore.getState().setCurrentOrg({ id: '1', name: 'a', slug: 'a', roleInOrg: 'a' });

    resetCoreSessionStores();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useUserStore.getState().profile).toBeNull();
    expect(useOrgStore.getState().currentOrg).toBeNull();
  });
});
