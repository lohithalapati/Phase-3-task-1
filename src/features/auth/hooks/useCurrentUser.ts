import { useAuth } from './useAuth';
import { AuthUser } from '../types';

export function useCurrentUser(): AuthUser {
  return useAuth().state.user;
}
