import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { AuthLoader } from '../../features/auth/components/AuthLoader';

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (state.status === 'loading') {
    return <div className="min-h-screen flex bg-slate-900 items-center justify-center"><AuthLoader /></div>;
  }

  if (state.status === 'authenticated') {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
