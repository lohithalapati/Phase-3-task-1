import { createEnterpriseStore } from './storeFactory';
import { HydrationState } from './types';

export const useHydrationStore = createEnterpriseStore<HydrationState>(
  (set, get) => ({
    hydratedStores: {},
    setStoreHydrated: (storeName) =>
      set(
        (state) => ({
          hydratedStores: { ...state.hydratedStores, [storeName]: true },
        }),
        false,
        `hydration/setHydrated/${storeName}`
      ),
    isStoreHydrated: (storeName) => !!get().hydratedStores[storeName],
    allHydrationComplete: () => {
      const essentialStores = ['user', 'org', 'theme', 'settings'];
      return essentialStores.every((store) => get().hydratedStores[store]);
    },
  }),
  {
    name: 'hydration',
    persistType: 'none',
  }
);
