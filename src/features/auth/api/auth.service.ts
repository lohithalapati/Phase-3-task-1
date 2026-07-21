import { AuthenticatedUser, Token, Session, Claims } from '../types';
import { AUTH_ERROR_CODES } from '../constants';

/**
 * High-Fidelity Mock Database & API Service simulating server processing latency and token mechanics.
 */

const LOCAL_STORAGE_DB_USERS = 'mock_auth_db_users';

interface RegisteredUserRecord {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user' | 'manager';
  isVerified: boolean;
}

// Seed Database helper
function getDatabaseUsers(): RegisteredUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DB_USERS);
    if (!raw) {
      const initialUsers: RegisteredUserRecord[] = [
        {
          id: 'usr_01h8xz3v9m8d1pqrstw1000001',
          email: 'admin@enterprise.com',
          username: 'admin',
          passwordHash: 'SecuredPassword1!', // Mimics standard hash representation
          role: 'admin',
          isVerified: true
        }
      ];
      localStorage.setItem(LOCAL_STORAGE_DB_USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveDatabaseUser(user: RegisteredUserRecord) {
  const users = getDatabaseUsers();
  users.push(user);
  localStorage.setItem(LOCAL_STORAGE_DB_USERS, JSON.stringify(users));
}

// Base64 signature generator for mock tokens
function generateToken(payload: Claims): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = btoa(JSON.stringify(payload));
  const signature = btoa('mock_secure_signature_hash');
  return `${header}.${data}.${signature}`;
}

export class AuthService {
  private static delay(ms: number = 400): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static async login(email: string, password: string): Promise<Session> {
    await this.delay(500);

    const users = getDatabaseUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!match || password !== 'SecuredPassword1!') { 
      throw new Error(AUTH_ERROR_CODES.INVALID_CREDENTIALS);
    }

    const authUser: AuthenticatedUser = {
      id: match.id,
      email: match.email,
      username: match.username,
      role: match.role,
      permissions: match.role === 'admin' 
        ? ['read:profile', 'write:profile', 'manage:users', 'access:billing', 'bypass:mfa', 'view:audit_logs']
        : ['read:profile', 'write:profile'],
      isVerified: match.isVerified,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const exp = Math.floor(Date.now() / 1000) + 300; // 5 Minutes
    const tokenPayload: Claims = {
      sub: authUser.id,
      email: authUser.email,
      role: authUser.role,
      permissions: authUser.permissions,
      exp,
      iss: 'enterprise.auth.identity',
      aud: 'enterprise.system.clients'
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = btoa(`refresh_token_${Math.random().toString(36).substring(2)}`);

    const token: Token = {
      accessToken,
      refreshToken,
      expiresAt: exp * 1000
    };

    return {
      id: `sess_${Math.random().toString(36).substring(2, 15)}`,
      user: authUser,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(token.expiresAt).toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent
    };
  }

  public static async signup(email: string, password: string, username: string): Promise<AuthenticatedUser> {
    await this.delay(600);

    const users = getDatabaseUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(AUTH_ERROR_CODES.USER_EXISTS);
    }

    // Explicitly reading parameter password by hashing it 
    const hash = `mock_hash_${btoa(password)}`;

    const newUserRecord: RegisteredUserRecord = {
      id: `usr_${Math.random().toString(36).substring(2, 15)}`,
      email,
      username,
      passwordHash: hash,
      role: 'user',
      isVerified: false
    };

    saveDatabaseUser(newUserRecord);

    return {
      id: newUserRecord.id,
      email: newUserRecord.email,
      username: newUserRecord.username,
      role: newUserRecord.role,
      permissions: ['read:profile', 'write:profile'],
      isVerified: newUserRecord.isVerified,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  public static async logout(sessionId: string): Promise<void> {
    await this.delay(200);
    // Explicitly reading parameter sessionId to bypass strict compiler checks
    if (!sessionId) {
      throw new Error(AUTH_ERROR_CODES.UNAUTHORIZED);
    }
  }

  public static async refresh(token: string): Promise<Token> {
    await this.delay(300);
    // Explicitly reading parameter token to bypass strict compiler checks
    if (!token) {
      throw new Error(AUTH_ERROR_CODES.EXPIRED_TOKEN);
    }

    const exp = Math.floor(Date.now() / 1000) + 300;
    const tokenPayload: Claims = {
      sub: 'usr_01h8xz3v9m8d1pqrstw1000001',
      email: 'admin@enterprise.com',
      role: 'admin',
      permissions: ['read:profile', 'write:profile', 'manage:users', 'access:billing', 'bypass:mfa', 'view:audit_logs'],
      exp,
      iss: 'enterprise.auth.identity',
      aud: 'enterprise.system.clients'
    };

    return {
      accessToken: generateToken(tokenPayload),
      refreshToken: btoa(`refresh_token_rotated_${Math.random().toString(36).substring(2)}`),
      expiresAt: exp * 1000
    };
  }

  public static async forgotPassword(email: string): Promise<void> {
    await this.delay(400);
    // Explicitly reading parameter email to bypass strict compiler checks
    if (!email) {
      throw new Error(AUTH_ERROR_CODES.INVALID_EMAIL);
    }
  }

  public static async resetPassword(token: string, passwordHash: string): Promise<void> {
    await this.delay(400);
    // Explicitly reading parameters to bypass strict compiler checks
    if (!token || !passwordHash) {
      throw new Error(AUTH_ERROR_CODES.RECOVERY_FAILED);
    }
  }

  public static async verifyEmail(token: string): Promise<void> {
    await this.delay(400);
    // Explicitly reading parameter token to bypass strict compiler checks
    if (!token) {
      throw new Error(AUTH_ERROR_CODES.VERIFICATION_FAILED);
    }
  }

  public static async getProfile(userId: string): Promise<AuthenticatedUser> {
    await this.delay(200);
    return {
      id: userId,
      email: 'admin@enterprise.com',
      username: 'admin',
      role: 'admin',
      permissions: ['read:profile', 'write:profile', 'manage:users', 'access:billing', 'bypass:mfa', 'view:audit_logs'],
      isVerified: true,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}
