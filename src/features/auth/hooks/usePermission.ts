import { useAuth } from './useAuth';
import { Permission } from '../types';

export function usePermission(permission: Permission): boolean {
  return useAuth().hasPermission(permission);
}
