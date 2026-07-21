import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('user_role') || 'guest';

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={ROUTES.ERRORS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};