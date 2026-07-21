import { createEnterpriseStore } from './storeFactory';
import { LoadingState } from './types';

export const useLoadingStore = createEnterpriseStore<LoadingState>(
  (set, get) => ({
    loaders: {},
    startLoading: (key) =>
      set(
        (state) => ({ loaders: { ...state.loaders, [key]: true } }),
        false,
        `loading/start/${key}`
      ),
    stopLoading: (key) =>
      set(
        (state) => ({ loaders: { ...state.loaders, [key]: false } }),
        false,
        `loading/stop/${key}`
      ),
    isLoading: (key) => !!get().loaders[key],
  }),
  {
    name: 'loading',
    persistType: 'none',
  }
);
