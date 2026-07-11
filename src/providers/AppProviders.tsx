import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { BaseComponentProps } from '@shared/types';

export const AppProviders: React.FC<BaseComponentProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};
