import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { AuthLoader } from '../../features/auth/components/AuthLoader';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();

  if (state.status === 'loading' || state.status === 'idle') {
    return <div className="min-h-screen flex bg-slate-900 items-center justify-center"><AuthLoader /></div>;
  }

  if (state.status === 'unauthenticated' || state.status === 'expired') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
