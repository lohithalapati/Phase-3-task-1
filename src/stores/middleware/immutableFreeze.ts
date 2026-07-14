import { StateCreator, StoreMutatorIdentifier } from 'zustand';

export const deepFreeze = <T>(obj: T): T => {
  if (obj === null || obj === undefined) return obj;
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
};

export const immutableFreeze = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>
): StateCreator<T, Mps, Mcs> => (set, get, store) => {
  const frozenSet: typeof set = (...args) => {
    set(...args);
    if (process.env.NODE_ENV !== 'production') {
      deepFreeze(get());
    }
  };
  return f(frozenSet, get, store);
};
