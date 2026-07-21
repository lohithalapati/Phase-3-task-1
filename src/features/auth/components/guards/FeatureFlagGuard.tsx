import React from 'react';
import { Navigate } from 'react-router-dom';
import { FeatureFlagSystem, FeatureFlags } from '@config/features.config';
import { ROUTES } from '@shared/constants/routes';

interface FeatureFlagGuardProps {
  children: React.ReactNode;
  flagName: keyof FeatureFlags;
}

export const FeatureFlagGuard: React.FC<FeatureFlagGuardProps> = ({ children, flagName }) => {
  const isEnabled = FeatureFlagSystem.isEnabled(flagName);

  if (!isEnabled) {
    return <Navigate to={ROUTES.PROTECTED.DASHBOARD} replace />;
  }

  return <>{children}</>;
};