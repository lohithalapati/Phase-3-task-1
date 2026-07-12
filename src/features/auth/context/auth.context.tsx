import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { AuthenticationState, AuthUser, Session, Permission } from '../types';
import { storage } from '../services/storage';
import { AUTH_KEYS, SESSION_CONFIG } from '../constants';
import { AuthService } from '../api/auth.service';
import { isTokenExpired } from '../utils/jwt';

export interface AuthContextType {
  state: AuthenticationState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const defaultGuestUser: AuthUser = {
  id: 'guest',
  email: '',
  username: 'guest',
  role: 'guest',
  permissions: [],
  isVerified: false,
  mfaEnabled: false,
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthenticationState>(() => {
    const cachedSession = storage.get(AUTH_KEYS.SESSION_KEY);
    if (cachedSession) {
      try {
        const session = JSON.parse(cachedSession) as Session;
        if (!isTokenExpired(session.token.accessToken)) {
          return {
            status: 'authenticated',
            user: session.user,
            session,
            error: null,
          };
        }
      } catch {
        storage.remove(AUTH_KEYS.SESSION_KEY);
      }
    }
    return {
      status: 'unauthenticated',
      user: defaultGuestUser,
      session: null,
      error: null,
    };
  });

  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const idleTimer = useRef<number | null>(null);
  const rotationTimer = useRef<number | null>(null);

  // Synchronize dynamic updates across duplicate active tabs
  useEffect(() => {
    broadcastChannel.current = new BroadcastChannel(AUTH_KEYS.BROADCAST_CHANNEL);
    broadcastChannel.current.onmessage = (event) => {
      if (event.data === 'LOGOUT') {
        setState({
          status: 'unauthenticated',
          user: defaultGuestUser,
          session: null,
          error: null,
        });
      } else if (event.data === 'SESSION_EXPIRED') {
        setState({
          status: 'expired',
          user: defaultGuestUser,
          session: null,
          error: { code: 'SESSION_EXPIRED', message: 'Your session has expired.' },
        });
      }
    };

    return () => {
      broadcastChannel.current?.close();
    };
  }, []);

  const clearSessionTimers = useCallback(() => {
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (rotationTimer.current) window.clearTimeout(rotationTimer.current);
  }, []);

  const handleLogoutCleanup = useCallback(() => {
    clearSessionTimers();
    storage.remove(AUTH_KEYS.SESSION_KEY);
    setState({
      status: 'unauthenticated',
      user: defaultGuestUser,
      session: null,
      error: null,
    });
    broadcastChannel.current?.postMessage('LOGOUT');
  }, [clearSessionTimers]);

  const startSessionTimers = useCallback((session: Session) => {
    clearSessionTimers();

    // 1. Setup Idle Timeout Action
    const resetIdleTimer = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        handleLogoutCleanup();
        setState(prev => ({
          ...prev,
          status: 'expired',
          error: { code: 'SESSION_EXPIRED', message: 'Your session timed out from inactivity.' }
        }));
        broadcastChannel.current?.postMessage('SESSION_EXPIRED');
      }, SESSION_CONFIG.IDLE_TIMEOUT_MS);
    };

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetIdleTimer));
    resetIdleTimer();

    // 2. Setup Automatic Rotation Cycle
    const runTokenRotation = async () => {
      try {
        const rotatedToken = await AuthService.refresh(session.token.refreshToken);
        const updatedSession: Session = {
          ...session,
          token: rotatedToken,
          expiresAt: new Date(rotatedToken.expiresAt).toISOString(),
        };
        storage.set(AUTH_KEYS.SESSION_KEY, JSON.stringify(updatedSession));
        setState(prev => ({
          ...prev,
          session: updatedSession
        }));
        startSessionTimers(updatedSession);
      } catch {
        handleLogoutCleanup();
      }
    };

    rotationTimer.current = window.setTimeout(runTokenRotation, SESSION_CONFIG.REFRESH_INTERVAL_MS);

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [clearSessionTimers, handleLogoutCleanup]);

  // Restart active timers on mount if already authenticated
  useEffect(() => {
    if (state.status === 'authenticated' && state.session) {
      const cleanListeners = startSessionTimers(state.session);
      return () => {
        cleanListeners?.();
      };
    }
  }, [state.status, state.session, startSessionTimers]);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const session = await AuthService.login(email, password);
      storage.set(AUTH_KEYS.SESSION_KEY, JSON.stringify(session));
      setState({
        status: 'authenticated',
        user: session.user,
        session,
        error: null,
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: 'unauthenticated',
        error: { code: err.message || 'LOGIN_FAILED', message: 'Invalid credentials provided.' },
      }));
      throw err;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      await AuthService.signup(email, password, username);
      setState({
        status: 'unauthenticated',
        user: defaultGuestUser,
        session: null,
        error: null,
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: 'unauthenticated',
        error: { code: err.message || 'SIGNUP_FAILED', message: 'Email address already registered.' },
      }));
      throw err;
    }
  };

  const logout = async () => {
    if (state.session) {
      try {
        await AuthService.logout(state.session.id);
      } catch {
        // Fallback cleanup
      }
    }
    handleLogoutCleanup();
  };

  const forceRefresh = async () => {
    if (!state.session) return;
    try {
      const rotated = await AuthService.refresh(state.session.token.refreshToken);
      const updated: Session = {
        ...state.session,
        token: rotated,
        expiresAt: new Date(rotated.expiresAt).toISOString()
      };
      storage.set(AUTH_KEYS.SESSION_KEY, JSON.stringify(updated));
      setState(prev => ({ ...prev, session: updated }));
    } catch (err) {
      handleLogoutCleanup();
    }
  };

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (state.user.role === 'admin') return true; 
    return (state.user.permissions as Permission[]).includes(permission);
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, login, signup, logout, forceRefresh, clearError, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
