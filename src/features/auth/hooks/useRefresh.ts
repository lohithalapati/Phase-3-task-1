import { useAuth } from './useAuth';

export function useRefresh() {
  const { forceRefresh } = useAuth();
  return forceRefresh;
}
