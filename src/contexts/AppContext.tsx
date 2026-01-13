import React, { createContext, useContext, ReactNode } from 'react';
import { useAppState } from '@/hooks/useAppState';

type AppContextType = ReturnType<typeof useAppState>;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const appState = useAppState();

  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
