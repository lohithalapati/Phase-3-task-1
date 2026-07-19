import React, { createContext, useContext, ReactNode } from 'react';

interface NotificationContextValue {
  initialized: boolean;
}

const NotificationContext = createContext<NotificationContextValue>({
  initialized: false
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  return (
    <NotificationContext.Provider value={{ initialized: true }}>
      <div
        aria-live="polite"
        aria-atomic="true"
        aria-label="Notification region"
        role="status"
        style={{ position: 'relative' }}
      >
        {children}
      </div>
    </NotificationContext.Provider>
  );
};
