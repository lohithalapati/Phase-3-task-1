import { useAuthStore } from './authStore';
import { useUserStore } from './userStore';
import { useOrgStore } from './orgStore';
import { storeEventBus } from './storeEventBus';

/**
 * Synchronous state-clearing orchestrator preventing race conditions during logout transitions
 */
export const resetCoreSessionStores = () => {
  useAuthStore.getState().clearCredentials();
  useUserStore.getState().clearUser();
  useOrgStore.getState().clearOrg();
  storeEventBus.publish('AUTH_LOGOUT');
};
