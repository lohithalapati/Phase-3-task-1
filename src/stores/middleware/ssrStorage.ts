import { StateStorage } from 'zustand/middleware';

export const createSafeStorage = (storageType: 'local' | 'session' = 'local'): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null;
      try {
        const store = storageType === 'local' ? localStorage : sessionStorage;
        return store.getItem(name);
      } catch (error) {
        console.error(`Failed to read from storage: ${name}`, error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      if (typeof window === 'undefined') return;
      try {
        const store = storageType === 'local' ? localStorage : sessionStorage;
        store.setItem(name, value);
      } catch (error) {
        console.error(`Failed to write to storage: ${name}`, error);
      }
    },
    removeItem: (name: string): void => {
      if (typeof window === 'undefined') return;
      try {
        const store = storageType === 'local' ? localStorage : sessionStorage;
        store.removeItem(name);
      } catch (error) {
        console.error(`Failed to remove item: ${name}`, error);
      }
    },
  };
};
