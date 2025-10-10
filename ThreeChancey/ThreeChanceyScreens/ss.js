import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import LinearGradient from 'react-native-linear-gradient';
import { chanseyquotes } from '../ThreeChanceyData/chanseyquotes';
import { useStore } from '../ThreeChanseyStore/ThreeChanseyContext';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

const CATEGORY_COLORS = {
  Motivation: '#F04E2A',
  Productivity: '#4D9BD2',
  Mindfulness: '#FFD848',
};

const STORAGE_KEY = 'THREE_CHANCEY_QUOTE';
const SAVED_QUOTES_KEY = 'THREE_CHANCEY_SAVED_QUOTES';

const ThreeChanceyHomeScreen = () => {
  const [quote, setQuote] = useState(null);
  const [category, setCategory] = useState(null);
  const [saved, setSaved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState(
    "Choose a color and find out today's quote",
  );

  const {
    loadSavedQuotes,
    savedQuotes,
    setSavedQuotes,
    isEnabledNotifications,
    setIsEnabledNotifications,
  } = useStore();

  useEffect(() => {
    loadSavedQuotes();
    checkLastChoice();
    loadThreeChanceyNtf();
  }, []);

  const loadThreeChanceyNtf = async () => {
    try {
      const notifValue = await AsyncStorage.getItem('isOnNotification');
      if (notifValue !== null) {
        const isNotifOn = JSON.parse(notifValue);

        setIsEnabledNotifications(isNotifOn);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const isSaved = () => {
    if (!quote || !category) return false;
    return savedQuotes[category]?.some(item => item.quote === quote);
  };

  const toggleSaveQuote = async () => {
    if (!quote || !category) return;

    try {
      const updated = { ...savedQuotes };
      const exists = updated[category]?.some(item => item.quote === quote);

      if (exists) {
        updated[category] = updated[category].filter(
          item => item.quote !== quote,
        );
        setSaved(false);
        if (isEnabledNotifications) {
          Toast.show({
            text1: 'Quote removed from saved!',
          });
        }
      } else {
        if (!updated[category]) updated[category] = [];
        updated[category].push({ quote, timestamp: Date.now() });
        setSaved(true);
        if (isEnabledNotifications) {
          Toast.show({
            text1: 'Quote saved!',
          });
        }
      }

      setSavedQuotes(updated);
      await AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updated));

      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        parsed.saved = !exists;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (e) {
      console.log('Error toggling saved quote:', e);
    }
  };

  const checkLastChoice = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const now = Date.now();
        const diff = now - parsed.timestamp;

        if (diff < 24 * 60 * 60 * 1000) {
          setQuote(parsed.quote);
          setCategory(parsed.category);
          setSaved(parsed.saved || false);
          setLocked(true);
          setMessage('You have already made a choice today!');
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.log('Error checking last choice:', e);
    }
  };

  const handleCategoryPress = async cat => {
    if (locked) {
      Alert.alert('Come back later', 'You can get a new quote in 24 hours.');
      return;
    }

    const randomQuote =
      chanseyquotes[cat][Math.floor(Math.random() * chanseyquotes[cat].length)];

    setQuote(randomQuote);
    setCategory(cat);
    setSaved(false);
    setLocked(true);
    setMessage('Good choice!');

    const timestamp = Date.now();
    const data = { quote: randomQuote, category: cat, timestamp, saved: false };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('Error saving temporary quote:', e);
    }
  };

  const quoteContainerColor = category ? CATEGORY_COLORS[category] : '#FFFFFF';

  return (
    <ThreeChanceyBackground>
      <View style={styles.container}>
        <LinearGradient
          colors={['#7C7C7C', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../../assets/images/chanceymenulgo.png')}
              style={{ position: 'absolute', left: 12 }}
            />
            <Text style={styles.welcomeText}>Main menu</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={{ paddingHorizontal: 42 }}>
        {!quote ? (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.menuContainer, { backgroundColor: '#F04E2A' }]}
              onPress={() => handleCategoryPress('Motivation')}
              disabled={locked}
            >
              <Text style={styles.menuText}>Motivation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.menuContainer, { backgroundColor: '#4D9BD2' }]}
              onPress={() => handleCategoryPress('Productivity')}
              disabled={locked}
            >
              <Text style={styles.menuText}>Productivity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.menuContainer, { backgroundColor: '#FFD848' }]}
              onPress={() => handleCategoryPress('Mindfulness')}
              disabled={locked}
            >
              <Text style={styles.menuText}>Mindfulness</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={[
              styles.quoteContainer,
              { backgroundColor: quoteContainerColor },
            ]}
          >
            <Text style={styles.quoteText}>{quote}</Text>

            <View style={{ flexDirection: 'row', marginTop: 50, gap: 15 }}>
              <TouchableOpacity onPress={toggleSaveQuote}>
                {saved ? (
                  <Image
                    source={require('../../assets/images/chanceysavedquo.png')}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/chanceysavequo.png')}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Share', 'Share feature coming soon!')
                }
              >
                <Image source={require('../../assets/images/chanceyshr.png')} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        <View style={{ height: 250 }} />
      </View>

      <View style={{ position: 'absolute', bottom: 110, right: 47 }}>
        <Image source={require('../../assets/images/chanceyhm.png')} />
      </View>
    </ThreeChanceyBackground>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: height * 0.044 },
  headerGradient: {
    borderRadius: 30,
    width: '88%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  welcomeContainer: {
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 27,
    height: 86,
    alignSelf: 'center',
    margin: 4,
  },
  welcomeText: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  menuContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.015,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    height: 108,
    alignSelf: 'center',
  },
  menuText: {
    fontWeight: '800',
    fontSize: 24,
    color: '#fff',
  },
  messageContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#7C7C7C',
    borderRadius: 50,
    borderBottomRightRadius: 0,
    padding: 20,
  },
  messageText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  quoteContainer: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 18,
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteText: {
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
});

export default ThreeChanceyHomeScreen;
