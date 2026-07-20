import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { AppConfig, FeatureFlags } from '../types';
import { LocalProvider } from '../adapters/LocalProvider';

export interface ConfigContextProps {
  config: AppConfig;
  flags: FeatureFlags;
}

export const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

const systemAdapter = new LocalProvider();

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConfigContextProps>(() => ({
    config: systemAdapter.getConfig(),
    flags: systemAdapter.getFeatureFlags()
  }));

  useEffect(() => {
    const unsubscribe = systemAdapter.onConfigChange((updatedConfig) => {
      setState({
        config: updatedConfig,
        flags: systemAdapter.getFeatureFlags()
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <ConfigContext.Provider value={state}>
      {children}
    </ConfigContext.Provider>
  );
};
