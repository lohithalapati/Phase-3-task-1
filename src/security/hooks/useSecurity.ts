import { useContext } from 'react';
import { SecurityContext, SecurityContextProps } from '../providers/SecurityProvider';

export function useSecurity(): SecurityContextProps {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('CRITICAL ARCHITECTURE VIOLATION: useSecurity hook accessed outside SecurityProvider.');
  }
  return context;
}
