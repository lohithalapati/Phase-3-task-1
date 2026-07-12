import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission, Permission } from '../../features/auth';

interface RoleGuardProps {
  permission: Permission;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ permission, children }) => {
  const isAllowed = usePermission(permission);

  if (!isAllowed) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
