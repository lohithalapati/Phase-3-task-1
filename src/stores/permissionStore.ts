import { useAuthStore } from './authStore';
import { useUserStore } from './userStore';
import { useOrgStore } from './orgStore';
import { useSettingsStore } from './settingsStore';

export const getDerivedPermissions = (): string[] => {
  const auth = useAuthStore.getState();
  const user = useUserStore.getState();
  const org = useOrgStore.getState();

  if (!auth.isAuthenticated || !user.profile) return [];
  
  const basePermissions = user.profile.roles.includes('admin') ? ['*'] : ['read:own'];
  
  if (org.currentOrg) {
    if (org.currentOrg.roleInOrg === 'Owner') {
      return [...basePermissions, 'org:write', 'org:delete', 'org:admin'];
    }
    if (org.currentOrg.roleInOrg === 'Editor') {
      return [...basePermissions, 'org:write'];
    }
  }
  return basePermissions;
};

export const checkPermissionStatic = (permission: string): boolean => {
  const list = getDerivedPermissions();
  if (list.includes('*')) return true;
  return list.includes(permission);
};

export const checkFeatureFlagStatic = (flag: string): boolean => {
  const flags = useSettingsStore.getState().featureFlags;
  return !!flags[flag];
};

export const usePermissionStore = () => {
  const profile = useUserStore((state) => state.profile);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const featureFlags = useSettingsStore((state) => state.featureFlags);

  const getPermissions = (): string[] => {
    if (!isAuthenticated || !profile) return [];
    
    const basePermissions = profile.roles.includes('admin') ? ['*'] : ['read:own'];
    
    if (currentOrg) {
      if (currentOrg.roleInOrg === 'Owner') {
        return [...basePermissions, 'org:write', 'org:delete', 'org:admin'];
      }
      if (currentOrg.roleInOrg === 'Editor') {
        return [...basePermissions, 'org:write'];
      }
    }
    return basePermissions;
  };

  const hasPermission = (permission: string): boolean => {
    const list = getPermissions();
    if (list.includes('*')) return true;
    return list.includes(permission);
  };

  const isSuperAdmin = (): boolean => {
    return profile?.roles.includes('super-admin') || false;
  };

  const isFeatureEnabled = (flag: string): boolean => {
    return !!featureFlags[flag];
  };

  return {
    getPermissions,
    hasPermission,
    isSuperAdmin,
    isFeatureEnabled,
  };
};
