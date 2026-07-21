export type UserRole = 'guest' | 'user' | 'analyst' | 'admin' | 'superadmin';

export interface SecuritySession {
  userId: string;
  username: string;
  role: UserRole;
  permissions: readonly string[];
  expiresAt: number;
  csrfToken: string;
}

export interface SecurityState {
  session: SecuritySession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StorageItem<T> {
  value: T;
  expiresAt: number | null;
  namespace: string;
  version: string;
}

export interface AuditPayload {
  eventId: string;
  timestamp: string;
  action: string;
  userId?: string;
  details: Record<string, any>;
  userAgent: string;
}

// Missing type aliases that other modules expect
export type UserSession = SecuritySession;
export type SecurityPermission = string;

