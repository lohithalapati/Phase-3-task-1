import { create, StateCreator } from 'zustand';
import { devtools, persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { logger } from './middleware/logger';
import { crossTabSync } from './middleware/crossTabSync';
import { immutableFreeze } from './middleware/immutableFreeze';
import { createSafeStorage } from './middleware/ssrStorage';
import { storeDiagnostics } from './middleware/diagnostics';

interface StoreFactoryOptions<T> {
  name: string;
  persistType?: 'local' | 'session' | 'none';
  version?: number;
  migrate?: (persistedState: any, version: number) => any;
  partialize?: (state: T) => Partial<T>;
  enableSync?: boolean;
  onRehydrate?: () => void;
}

export const createEnterpriseStore = <T extends object>(
  creator: StateCreator<T, [['zustand/devtools', never], ['zustand/subscribeWithSelector', never]], []>,
  options: StoreFactoryOptions<T>
) => {
  let middlewareStack = creator;

  // 1. Immutable Freezing (Development-Only)
  if (process.env.NODE_ENV !== 'production') {
    middlewareStack = immutableFreeze(middlewareStack);
  }

  // 2. Wrap selectors and dispatch diagnostics updates
  let decoratedCreator = devtools(
    subscribeWithSelector(
      (set, get, store) => {
        const instrumentedSet: typeof set = (...args) => {
          set(...args);
          storeDiagnostics.recordUpdate(options.name, get());
        };
        return middlewareStack(instrumentedSet, get, store);
      }
    ),
    { name: options.name }
  );

  // 3. Tab State Synchronization
  if (options.enableSync) {
    decoratedCreator = crossTabSync(decoratedCreator, options.name) as any;
  }

  // 4. Action DevTools Logging
  decoratedCreator = logger(decoratedCreator, options.name) as any;

  // 5. Schema Persistence Bridge
  if (options.persistType && options.persistType !== 'none') {
    const startHydration = typeof performance !== 'undefined' ? performance.now() : Date.now();
    decoratedCreator = persist(decoratedCreator, {
      name: `ent-${options.name}-state`,
      storage: createJSONStorage(() => createSafeStorage(options.persistType === 'session' ? 'session' : 'local')),
      version: options.version ?? 0,
      migrate: options.migrate,
      partialize: options.partialize,
      onRehydrateStorage: () => () => {
        const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startHydration;
        storeDiagnostics.recordHydration(options.name, elapsed);
        if (options.onRehydrate) {
          options.onRehydrate();
        }
      }
    }) as any;
  }

  return create<T>()(decoratedCreator as any);
};
