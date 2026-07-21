/**
 * Strict Domain Model Definitions for Enterprise Auth
 */

export type Role = 'admin' | 'user' | 'manager' | 'guest';

export type Permission =
  | 'read:profile'
  | 'write:profile'
  | 'manage:users'
  | 'access:billing'
  | 'bypass:mfa'
  | 'view:audit_logs';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser extends User {
  role: Role;
  permissions: Permission[];
  isVerified: boolean;
  mfaEnabled: boolean;
}

export interface GuestUser {
  id: 'guest';
  email: '';
  username: 'guest';
  role: 'guest';
  permissions: [];
  isVerified: false;
  mfaEnabled: false;
}

export type AuthUser = AuthenticatedUser | GuestUser;

export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in ms
}

export interface Session {
  id: string;
  user: AuthenticatedUser;
  token: Token;
  createdAt: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface Claims {
  sub: string;
  email: string;
  role: Role;
  permissions: Permission[];
  exp: number; // Expiry timestamp
  iss: string; // Issuer
  aud: string; // Audience
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'expired';

export interface AuthenticationState {
  status: AuthStatus;
  user: AuthUser;
  session: Session | null;
  error: { code: string; message: string } | null;
}
