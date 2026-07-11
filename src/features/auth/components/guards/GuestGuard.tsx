import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PROTECTED.DASHBOARD} replace />;
  }

  return <>{children}</>;
};