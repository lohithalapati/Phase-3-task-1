import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = (
  f: StateCreator<any, [], []>,
  name?: string
) => StateCreator<any, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      const prevState = get();
      set(...args);
      const nextState = get();
      console.groupCollapsed(`%cZUSTAND Action: [${name || 'Store'}]`, 'color: #3b82f6; font-weight: bold;');
      console.log('%cPrev State:', 'color: #9e9e9e; font-weight: bold;', prevState);
      console.log('%cNext State:', 'color: #4caf50; font-weight: bold;', nextState);
      console.groupEnd();
    } else {
      set(...args);
    }
  };
  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;
