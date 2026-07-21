import { createEnterpriseStore } from './storeFactory';
import { SidebarState } from './types';
import { STORE_VERSIONS } from './storeVersions';

export const useSidebarStore = createEnterpriseStore<SidebarState>(
  (set) => ({
    isOpen: true,
    isCollapsed: false,
    toggleSidebar: () =>
      set((state) => ({ isOpen: !state.isOpen }), false, 'sidebar/toggleSidebar'),
    setSidebarOpen: (isOpen) =>
      set({ isOpen }, false, 'sidebar/setSidebarOpen'),
    setSidebarCollapsed: (isCollapsed) =>
      set({ isCollapsed }, false, 'sidebar/setSidebarCollapsed'),
  }),
  {
    name: 'sidebar',
    persistType: 'local',
    version: STORE_VERSIONS.SIDEBAR_STORE,
    partialize: (state) => ({ isOpen: state.isOpen, isCollapsed: state.isCollapsed }),
  }
);
