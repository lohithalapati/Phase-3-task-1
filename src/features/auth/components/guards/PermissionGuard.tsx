import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: string[];
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, requiredPermissions }) => {
  const userPermissionsRaw = localStorage.getItem('user_permissions');
  let userPermissions: string[] = [];

  try {
    userPermissions = userPermissionsRaw ? JSON.parse(userPermissionsRaw) : [];
    if (!Array.isArray(userPermissions)) {
      userPermissions = [];
    }
  } catch (e) {
    console.error('[Multi-Tenant Permission Guard]: Failed to parse user permissions safely. Resetting credentials.', e);
    userPermissions = [];
  }

  const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

  if (!hasPermission) {
    return <Navigate to={ROUTES.ERRORS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};