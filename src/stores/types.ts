export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  roles: string[];
}

export interface UserPreferences {
  locale: string;
  compactMode: boolean;
  reduceMotion: boolean;
  marketingEmails: boolean;
}

export interface OrganizationContext {
  id: string;
  name: string;
  slug: string;
  roleInOrg: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export interface OfflineAction {
  id: string;
  timestamp: number;
  actionType: string;
  payload: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: number | null;
  userId: string | null;
  setCredentials: (accessToken: string, expiresAt: number, userId: string) => void;
  clearCredentials: () => void;
}

export interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  clearUser: () => void;
}

export interface OrgState {
  currentOrg: OrganizationContext | null;
  availableOrgs: OrganizationContext[];
  setCurrentOrg: (org: OrganizationContext) => void;
  setAvailableOrgs: (orgs: OrganizationContext[]) => void;
  clearOrg: () => void;
}

export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
}

export interface NotificationState {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface LoadingState {
  loaders: Record<string, boolean>;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  isLoading: (key: string) => boolean;
}

export interface SettingsState {
  timezone: string;
  telemetryEnabled: boolean;
  featureFlags: Record<string, boolean>;
  updateSettings: (settings: { timezone?: string; telemetryEnabled?: boolean }) => void;
  setFeatureFlag: (flag: string, value: boolean) => void;
  setFeatureFlags: (flags: Record<string, boolean>) => void;
  resetSettings: () => void;
}

export interface SystemState {
  isOnline: boolean;
  isMaintenanceMode: boolean;
  fatalError: string | null;
  offlineQueue: OfflineAction[];
  setOnlineStatus: (isOnline: boolean) => void;
  setMaintenanceMode: (isMaintenance: boolean) => void;
  setFatalError: (error: string | null) => void;
  enqueueOfflineAction: (actionType: string, payload: any) => void;
  clearOfflineQueue: () => void;
}

export interface HydrationState {
  hydratedStores: Record<string, boolean>;
  setStoreHydrated: (storeName: string) => void;
  isStoreHydrated: (storeName: string) => boolean;
  allHydrationComplete: () => boolean;
}
