import React, { createContext, useContext, useEffect } from "react";
import { NotificationPipeline } from "../pipeline/NotificationPipeline";
import { ToastHost } from "../toast/ToastHost";

interface NotificationContextProps {}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    NotificationPipeline.initialize();
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
      <ToastHost />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be wrapped inside a global NotificationProvider scope context");
  }
  return context;
};