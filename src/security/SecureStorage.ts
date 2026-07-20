import { StorageItem } from './types';
import { CryptoEngine } from './Crypto';

const STORAGE_VERSION = '1.0';
const STORAGE_NAMESPACE = 'nh_secure';

export class SecureStorage {
  private static buildKey(key: string): string {
    return `${STORAGE_NAMESPACE}_${key}`;
  }

  static set<T>(key: string, value: T, expiresInMs?: number): void {
    const item: StorageItem<T> = {
      value,
      expiresAt: expiresInMs ? Date.now() + expiresInMs : null,
      namespace: STORAGE_NAMESPACE,
      version: STORAGE_VERSION
    };

    try {
      const serialized = JSON.stringify(item);
      const encrypted = CryptoEngine.encryptSync(serialized);
      localStorage.setItem(this.buildKey(key), encrypted);
    } catch (error) {
      console.error('[SecureStorage] Failed to set item:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(this.buildKey(key));
      if (!encrypted) return null;

      const decrypted = CryptoEngine.decryptSync(encrypted);
      const item: StorageItem<T> = JSON.parse(decrypted);

      // Check expiration
      if (item.expiresAt && item.expiresAt < Date.now()) {
        this.remove(key);
        return null;
      }

      // Check version
      if (item.version !== STORAGE_VERSION) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('[SecureStorage] Failed to get item:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.buildKey(key));
    } catch (error) {
      console.error('[SecureStorage] Failed to remove item:', error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_NAMESPACE)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[SecureStorage] Failed to clear storage:', error);
    }
  }

  static has(key: string): boolean {
    return localStorage.getItem(this.buildKey(key)) !== null;
  }
  // Legacy aliases for test compatibility
  static setItem = SecureStorage.set;
  static getItem = SecureStorage.get;
  static removeItem = SecureStorage.remove;
}

