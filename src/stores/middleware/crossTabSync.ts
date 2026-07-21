import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type CrossTabSync = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  storeName: string
) => StateCreator<T, Mps, Mcs>;

type CrossTabSyncImpl = (
  f: StateCreator<any, [], []>,
  storeName: string
) => StateCreator<any, [], []>;

const crossTabSyncImpl: CrossTabSyncImpl = (f, storeName) => (set, get, store) => {
  if (typeof window === 'undefined') {
    return f(set, get, store);
  }

  const channelName = `ent-store-sync-${storeName}`;
  let channel: BroadcastChannel | null = null;

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(channelName);
      channel.onmessage = (event) => {
        if (event.data && typeof event.data === 'object') {
          set(event.data, false);
        }
      };
    }
  } catch (e) {
    console.warn(`BroadcastChannel not initialized for ${storeName}, using storage fallback:`, e);
  }

  window.addEventListener('storage', (event) => {
    if (event.key === `sync-trigger-${storeName}` && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        set(parsed, false);
      } catch (err) {
        console.error('Failed parsing sync payload:', err);
      }
    }
  });

  const syncedSet: typeof set = (nextStateOrUpdater, replace) => {
    set(nextStateOrUpdater, replace as any);
    const nextState = get();
    
    const serializableSlice: Record<string, any> = {};
    Object.keys(nextState).forEach((key) => {
      if (typeof nextState[key] !== 'function' && key !== 'loaders' && key !== 'notifications') {
        serializableSlice[key] = nextState[key];
      }
    });

    if (channel) {
      channel.postMessage(serializableSlice);
    } else {
      try {
        localStorage.setItem(`sync-trigger-${storeName}`, JSON.stringify(serializableSlice));
        localStorage.removeItem(`sync-trigger-${storeName}`);
      } catch (e) {
        // Handle browser Storage boundaries safely
      }
    }
  };

  return f(syncedSet, get, store);
};

export const crossTabSync = crossTabSyncImpl as unknown as CrossTabSync;

