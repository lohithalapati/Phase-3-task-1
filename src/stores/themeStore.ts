import { createEnterpriseStore } from './storeFactory';
import { ThemeState } from './types';
import { useHydrationStore } from './hydrationStore';
import { STORE_VERSIONS } from './storeVersions';

export const useThemeStore = createEnterpriseStore<ThemeState>(
  (set) => ({
    theme: 'system',
    setTheme: (theme) => set({ theme }, false, 'theme/setTheme'),
  }),
  {
    name: 'theme',
    persistType: 'local',
    version: STORE_VERSIONS.THEME_STORE,
    partialize: (state) => ({ theme: state.theme }),
    enableSync: true,
    onRehydrate: () => {
      useHydrationStore.getState().setStoreHydrated('theme');
    },
  }
);
