import { useContext } from 'react';
import { ConfigContext } from '../providers/ConfigProvider';
import { AppConfig } from '../types';

export function useConfig(): AppConfig {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('CRITICAL HOOK EXCEPTION: useConfig accessed outside ConfigProvider tree.');
  }
  return context.config;
}
