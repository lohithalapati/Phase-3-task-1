import { createEnterpriseStore } from './storeFactory';
import { AuthState } from './types';
import { STORE_VERSIONS } from './storeVersions';

export const useAuthStore = createEnterpriseStore<AuthState>(
  (set) => ({
    isAuthenticated: false,
    accessToken: null,
    expiresAt: null,
    userId: null,
    setCredentials: (accessToken, expiresAt, userId) =>
      set(
        { isAuthenticated: true, accessToken, expiresAt, userId },
        false,
        'auth/setCredentials'
      ),
    clearCredentials: () =>
      set(
        { isAuthenticated: false, accessToken: null, expiresAt: null, userId: null },
        false,
        'auth/clearCredentials'
      ),
  }),
  {
    name: 'auth',
    persistType: 'session',
    version: STORE_VERSIONS.AUTH_STORE,
    partialize: (state) => ({
      isAuthenticated: state.isAuthenticated,
      accessToken: state.accessToken,
      expiresAt: state.expiresAt,
      userId: state.userId,
    }),
  }
);
