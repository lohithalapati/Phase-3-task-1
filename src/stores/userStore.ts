import { createEnterpriseStore } from './storeFactory';
import { UserState } from './types';
import { useHydrationStore } from './hydrationStore';
import { STORE_VERSIONS } from './storeVersions';

const defaultPreferences = {
  locale: 'en',
  compactMode: false,
  reduceMotion: false,
  marketingEmails: false,
};

export const useUserStore = createEnterpriseStore<UserState>(
  (set) => ({
    profile: null,
    preferences: defaultPreferences,
    setProfile: (profile) =>
      set({ profile }, false, 'user/setProfile'),
    updatePreferences: (newPrefs) =>
      set(
        (state) => ({ preferences: { ...state.preferences, ...newPrefs } }),
        false,
        'user/updatePreferences'
      ),
    clearUser: () =>
      set({ profile: null, preferences: defaultPreferences }, false, 'user/clearUser'),
  }),
  {
    name: 'user',
    persistType: 'local',
    version: STORE_VERSIONS.USER_STORE,
    migrate: (persistedState: any, version: number) => {
      if (version === 0) {
        return { ...persistedState, preferences: defaultPreferences };
      }
      return persistedState as UserState;
    },
    partialize: (state) => ({
      profile: state.profile,
      preferences: state.preferences,
    }),
    enableSync: true,
    onRehydrate: () => {
      useHydrationStore.getState().setStoreHydrated('user');
    },
  }
);
