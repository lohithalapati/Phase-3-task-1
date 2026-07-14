import { createEnterpriseStore } from './storeFactory';
import { OrgState } from './types';
import { useHydrationStore } from './hydrationStore';
import { storeEventBus } from './storeEventBus';
import { STORE_VERSIONS } from './storeVersions';

export const useOrgStore = createEnterpriseStore<OrgState>(
  (set) => ({
    currentOrg: null,
    availableOrgs: [],
    setCurrentOrg: (org) => {
      set({ currentOrg: org }, false, 'org/setCurrentOrg');
      storeEventBus.publish('WORKSPACE_CHANGED', org);
    },
    setAvailableOrgs: (orgs) =>
      set({ availableOrgs: orgs }, false, 'org/setAvailableOrgs'),
    clearOrg: () =>
      set({ currentOrg: null, availableOrgs: [] }, false, 'org/clearOrg'),
  }),
  {
    name: 'org',
    persistType: 'local',
    version: STORE_VERSIONS.ORG_STORE,
    partialize: (state) => ({
      currentOrg: state.currentOrg,
      availableOrgs: state.availableOrgs,
    }),
    enableSync: true,
    onRehydrate: () => {
      useHydrationStore.getState().setStoreHydrated('org');
    },
  }
);
