import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { reduxStore } from '@repo/state';
import { initializeStateManager, setStateManagerType } from '@repo/state';

type StateProviderType = 'redux' | 'zustand';

interface StateProviderContextType {
  providerType: StateProviderType;
  setProviderType: (type: StateProviderType) => void;
}

const StateProviderContext = createContext<StateProviderContextType | undefined>(undefined);

export const useStateProvider = () => {
  const context = useContext(StateProviderContext);
  if (!context) {
    throw new Error('useStateProvider must be used within a StateProvider');
  }
  return context;
};

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [providerType, setProviderType] = useState<StateProviderType>('redux');

  // Initialize the global state manager when the component mounts
  useEffect(() => {
    initializeStateManager(providerType);
  }, []);

  // Update the global state manager when provider type changes
  useEffect(() => {
    setStateManagerType(providerType);
  }, [providerType]);

  const value = {
    providerType,
    setProviderType,
  };

  if (providerType === 'redux') {
    return (
      <StateProviderContext.Provider value={value}>
        <Provider store={reduxStore}>
          {children}
        </Provider>
      </StateProviderContext.Provider>
    );
  } else {
    // Zustand doesn't need a provider
    return (
      <StateProviderContext.Provider value={value}>
        {children}
      </StateProviderContext.Provider>
    );
  }
};