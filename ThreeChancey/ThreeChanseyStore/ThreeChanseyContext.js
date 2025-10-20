import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

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
  const [isEnabledMusic, setIsEnabledMusic] = useState(false);
  const [soundLevel, updateSoundLevel] = useState(1.0);

  useEffect(() => {
    (async () => {
      try {
        const fetchedVol = await AsyncStorage.getItem('volume');
        if (fetchedVol !== null && !isNaN(parseFloat(fetchedVol))) {
          updateSoundLevel(parseFloat(fetchedVol));
        }
      } catch (err) {
        console.log('Error', err);
      }
    })();
  }, []);

  const adjustVolumeLevel = async newLevel => {
    try {
      const stringifiedLevel = `${newLevel}`;
      await AsyncStorage.setItem('volume', stringifiedLevel);
      updateSoundLevel(newLevel);
    } catch (err) {
      console.log('Error', err);
    }
  };

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
    isEnabledMusic,
    setIsEnabledMusic,
    volume: soundLevel,
    setVolume: adjustVolumeLevel,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
