import { useContext } from 'react';
import { ConfigContext } from '../providers/ConfigProvider';
import { FeatureFlags } from '../types';

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('CRITICAL HOOK EXCEPTION: useFeatureFlag accessed outside ConfigProvider tree.');
  }
  return !!context.flags[flag];
}
