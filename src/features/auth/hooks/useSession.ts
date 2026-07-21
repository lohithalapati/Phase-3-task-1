import { useAuth } from './useAuth';
import { Session } from '../types';

export function useSession(): Session | null {
  return useAuth().state.session;
}
