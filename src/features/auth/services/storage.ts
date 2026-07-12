/**
 * Secure Storage Abstraction Layer
 */

export interface IStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

export class MemoryStorage implements IStorage {
  private cache = new Map<string, string>();

  get(key: string): string | null {
    return this.cache.get(key) || null;
  }
  set(key: string, value: string): void {
    this.cache.set(key, value);
  }
  remove(key: string): void {
    this.cache.delete(key);
  }
  clear(): void {
    this.cache.clear();
  }
}

export class LocalStorageEngine implements IStorage {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Safe fallback if blocked
    }
  }
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Safe fallback
    }
  }
  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // Safe fallback
    }
  }
}

export class SessionStorageEngine implements IStorage {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }
  set(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Safe fallback
    }
  }
  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Safe fallback
    }
  }
  clear(): void {
    try {
      sessionStorage.clear();
    } catch {
      // Safe fallback
    }
  }
}

class StorageService {
  private engine: IStorage;

  constructor() {
    this.engine = this.detectEngine();
  }

  private detectEngine(): IStorage {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return new LocalStorageEngine();
    } catch {
      return new MemoryStorage();
    }
  }

  public setEngine(engine: IStorage): void {
    this.engine = engine;
  }

  public get(key: string): string | null {
    return this.engine.get(key);
  }

  public set(key: string, value: string): void {
    this.engine.set(key, value);
  }

  public remove(key: string): void {
    this.engine.remove(key);
  }

  public clear(): void {
    this.engine.clear();
  }
}

export const storage = new StorageService();
