import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions: string[];
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ children, requiredPermissions }) => {
  const userPermissionsRaw = localStorage.getItem('user_permissions');
  const userPermissions: string[] = userPermissionsRaw ? JSON.parse(userPermissionsRaw) : [];

  const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

  if (!hasPermission) {
    return <Navigate to={ROUTES.ERRORS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};