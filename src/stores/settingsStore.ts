import { createEnterpriseStore } from './storeFactory';
import { SettingsState } from './types';
import { useHydrationStore } from './hydrationStore';
import { STORE_VERSIONS } from './storeVersions';

const initialSettings = {
  timezone: 'UTC',
  telemetryEnabled: true,
  featureFlags: {},
};

export const useSettingsStore = createEnterpriseStore<SettingsState>(
  (set) => ({
    ...initialSettings,
    updateSettings: (newSettings) =>
      set((state) => ({ ...state, ...newSettings }), false, 'settings/update'),
    setFeatureFlag: (flag, value) =>
      set(
        (state) => ({ featureFlags: { ...state.featureFlags, [flag]: value } }),
        false,
        `settings/setFlag/${flag}`
      ),
    setFeatureFlags: (flags) =>
      set({ featureFlags: flags }, false, 'settings/setFlags'),
    resetSettings: () =>
      set({ ...initialSettings }, false, 'settings/reset'),
  }),
  {
    name: 'settings',
    persistType: 'local',
    version: STORE_VERSIONS.SETTINGS_STORE,
    partialize: (state) => ({
      timezone: state.timezone,
      telemetryEnabled: state.telemetryEnabled,
      featureFlags: state.featureFlags,
    }),
    enableSync: true,
    onRehydrate: () => {
      useHydrationStore.getState().setStoreHydrated('settings');
    },
  }
);
