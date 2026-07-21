import { SecureStorage } from './SecureStorage';
import { UserSession } from './types';

const SESSION_KEY = 'nh_active_session';

export class SessionManager {
  static getActive(): UserSession | null {
    try {
      const raw = SecureStorage.get<UserSession>(SESSION_KEY);
      if (!raw) return null;
      
      // Check expiration
      if (raw.expiresAt && raw.expiresAt < Date.now()) {
        this.destroy();
        return null;
      }
      
      return raw;
    } catch {
      return null;
    }
  }

  static establish(session: UserSession, onExpire?: () => void): void {
    SecureStorage.set(SESSION_KEY, session);
    
    if (onExpire && session.expiresAt) {
      const timeout = session.expiresAt - Date.now();
      if (timeout > 0) {
        setTimeout(() => {
          this.destroy();
          onExpire();
        }, timeout);
      }
    }
  }

  static destroy(callback?: () => void): void {
    SecureStorage.remove(SESSION_KEY);
    if (callback) callback();
  }

  static refresh(session: UserSession): void {
    this.establish(session);
  }

  // Test helper methods (aliases for backwards compatibility)
  static setSession(session: UserSession): void {
    this.establish(session);
  }

  static getSession(): UserSession | null {
    return this.getActive();
  }

  static clearSession(): void {
    this.destroy();
  }
}
