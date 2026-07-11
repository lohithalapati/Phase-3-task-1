import React from 'react';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <React.StrictMode>
      {/* Future providers (Theme, Auth, Zustand, Query) injected here */}
      {children}
    </React.StrictMode>
  );
};
