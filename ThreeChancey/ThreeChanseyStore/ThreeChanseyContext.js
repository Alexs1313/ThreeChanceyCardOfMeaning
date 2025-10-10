import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';

export const StoreContext = createContext();

export const useStore = () => {
  return useContext(StoreContext);
};

const SAVED_QUOTES_KEY = 'THREE_CHANCEY_SAVED_QUOTES';

export const ContextProvider = ({ children }) => {
  const [savedQuotes, setSavedQuotes] = useState({
    Motivation: [],
    Productivity: [],
    Mindfulness: [],
  });
  const [isEnabledNotifications, setIsEnabledNotifications] = useState(false);

  const loadSavedQuotes = async () => {
    try {
      const savedData = await AsyncStorage.getItem(SAVED_QUOTES_KEY);
      if (savedData) setSavedQuotes(JSON.parse(savedData));
    } catch (e) {
      console.log('Error loading saved quotes:', e);
    }
  };

  const value = {
    loadSavedQuotes,
    savedQuotes,
    setSavedQuotes,
    isEnabledNotifications,
    setIsEnabledNotifications,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
