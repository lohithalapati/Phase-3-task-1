import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SecurityState, SecuritySession } from '../types';
import { SessionManager } from '../SessionManager';
import { CSPManager } from '../CSP';

export interface SecurityContextProps extends SecurityState {
  login: (session: SecuritySession) => void;
  logout: () => void;
}

export const SecurityContext = createContext<SecurityContextProps | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SecurityState>(() => {
    const active = SessionManager.getActive();
    return {
      session: active,
      isAuthenticated: !!active,
      isLoading: false
    };
  });

  const logout = useCallback(() => {
    SessionManager.destroy(() => {
      setState({
        session: null,
        isAuthenticated: false,
        isLoading: false
      });
    });
  }, []);

  const login = useCallback((session: SecuritySession) => {
    SessionManager.establish(session, () => {
      setState({
        session: null,
        isAuthenticated: false,
        isLoading: false
      });
    });
    setState({
      session,
      isAuthenticated: true,
      isLoading: false
    });
  }, []);

  useEffect(() => {
    CSPManager.initTrustedTypes();
    const active = SessionManager.getActive();
    if (active && active.expiresAt < Date.now()) {
      logout();
    }
  }, [logout]);

  return (
    <SecurityContext.Provider value={{ ...state, login, logout }}>
      {children}
    </SecurityContext.Provider>
  );
};
