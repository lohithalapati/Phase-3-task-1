import { useAuthStore } from '../authStore';
import { useUserStore } from '../userStore';
import { useOrgStore } from '../orgStore';
// import { useLoadingStore } from '../loadingStore';
import { useNotificationStore } from '../notificationStore';
import { useSystemStore } from '../systemStore';
import { useSettingsStore } from '../settingsStore';
import { checkPermissionStatic, checkFeatureFlagStatic } from '../permissionStore';
import { resetCoreSessionStores } from '../resetOrchestrator';
import { storeEventBus } from '../storeEventBus';
import { storeDiagnostics } from '../middleware/diagnostics';
import { deepFreeze } from '../middleware/immutableFreeze';

describe('Principal-Grade Global State System Engine Tests', () => {
  beforeEach(() => {
    useAuthStore.getState().clearCredentials();
    useUserStore.getState().clearUser();
    useOrgStore.getState().clearOrg();
    useNotificationStore.getState().clearNotifications();
    useSystemStore.getState().clearOfflineQueue();
    useSystemStore.getState().setFatalError(null);
    useSettingsStore.getState().resetSettings();
  });

  test('Immutability freezer: Protects deep records from mutation', () => {
    const rawState = { user: { profile: { name: 'Dev' } } };
    const frozen = deepFreeze(rawState);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.user.profile)).toBe(true);
  });

  test('Store Factory Metrics: Diagnostics engine tracks transactions', () => {
    useAuthStore.getState().setCredentials('metric-token', 1800, 'usr-1');
    const metrics = storeDiagnostics.getMetrics();
    const authMetric = metrics.find((m) => m.storeName === 'auth');
    expect(authMetric).toBeDefined();
    expect(authMetric!.actionCount).toBeGreaterThan(0);
  });

  test('Store Event Bus: Decouples communication via system messages', () => {
    let busFired = false;
    let payloadArg: any = null;
    const unsub = storeEventBus.subscribe('WORKSPACE_CHANGED', (payload) => {
      busFired = true;
      payloadArg = payload;
    });

    useOrgStore.getState().setCurrentOrg({
      id: 'workspace-a',
      name: 'Alpha Corp',
      slug: 'alpha',
      roleInOrg: 'Owner'
    });

    expect(busFired).toBe(true);
    expect(payloadArg.id).toBe('workspace-a');
    unsub();
  });

  test('Dynamic Permissions: Evaluates roles on organizational scopes', () => {
    useAuthStore.getState().setCredentials('scoped-token', 9999, 'usr-2');
    useUserStore.getState().setProfile({
      id: 'usr-2',
      email: 'team@corp.com',
      firstName: 'Jane',
      lastName: 'Doe',
      roles: ['user'],
    });

    useOrgStore.getState().setCurrentOrg({
      id: 'org-y',
      name: 'Beta Corp',
      slug: 'beta',
      roleInOrg: 'Owner',
    });

    expect(checkPermissionStatic('org:admin')).toBe(true);
    useSettingsStore.getState().setFeatureFlag('DASHBOARD_V2', true);
    expect(checkFeatureFlagStatic('DASHBOARD_V2')).toBe(true);
  });

  test('Session Cleansing: Synchronously resets core values on logout events', () => {
    useAuthStore.getState().setCredentials('token', 1, 'id');
    useUserStore.getState().setProfile({ id: 'id', email: 'e', firstName: 'f', lastName: 'l', roles: [] });
    
    resetCoreSessionStores();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useUserStore.getState().profile).toBeNull();
  });
});


