import { useContext } from 'react';
import { SecurityContext } from '../providers/SecurityProvider';
import { PermissionManager } from '../PermissionManager';
import { UserRole } from '../types';

export function usePermission() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('CRITICAL ARCHITECTURE VIOLATION: usePermission hook accessed outside SecurityProvider Context.');
  }

  const role: UserRole = context.session?.role || 'guest';
  const permissions: readonly string[] = context.session?.permissions || [];

  const hasRole = (targetRole: UserRole) => {
    return PermissionManager.hasRole(role, targetRole);
  };

  const hasPermission = (required: string) => {
    return PermissionManager.hasPermission(role, permissions, required);
  };

  return {
    role,
    permissions,
    hasRole,
    hasPermission
  };
}

