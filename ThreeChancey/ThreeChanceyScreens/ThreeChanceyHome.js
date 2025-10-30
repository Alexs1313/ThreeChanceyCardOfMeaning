import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Share,
  Platform,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import LinearGradient from 'react-native-linear-gradient';
import { useStore } from '../ThreeChanseyStore/ThreeChanseyContext';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Sound from 'react-native-sound';
import { chanseyquotes } from '../ThreeChanceyData/chanseyquotes';
import { BlurView } from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';

const { height } = Dimensions.get('window');

const CATEGORY_COLORS = {
  Motivation: '#F04E2A',
  Productivity: '#4D9BD2',
  Mindfulness: '#FFD848',
};

const STORAGE_KEY = 'THREE_CHANCEY_QUOTE';
const SAVED_QUOTES_KEY = 'THREE_CHANCEY_SAVED_QUOTES';
const DAYS_IN_WEEK = 7;
const DEFAULT_INDICATOR_COLOR = '#CCCCCC';

const ThreeChanceyHomeScreen = () => {
  const [quote, setQuote] = useState(null);
  const [category, setCategory] = useState(null);
  const [saved, setSaved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [chanceyModalVisible, setChanceyModalVisible] = useState(false);
  const [message, setMessage] = useState(
    "Choose a color and find out today's quote",
  );
  const [showRephrased, setShowRephrased] = useState(false);
  const [weekIndicator, setWeekIndicator] = useState(
    Array(DAYS_IN_WEEK).fill(DEFAULT_INDICATOR_COLOR),
  );

  const {
    loadSavedQuotes,
    savedQuotes,
    setSavedQuotes,
    isEnabledNotifications,
    setIsEnabledNotifications,
    isEnabledMusic,
    setIsEnabledMusic,
    volume,
  } = useStore();

  const [threeChanceyBgMusicTrackIndex, setThreeChanceyBgMusicTrackIndex] =
    useState(0);
  const [sound, setSound] = useState(null);
  const threeChanceyBgMusicTracks = [
    'relax-meditation-relax-music-311900.mp3',
    'relax-meditation-relax-music-311900.mp3',
  ];

  useEffect(() => {
    playThreeChanceyBgMusicTrack(threeChanceyBgMusicTrackIndex);
    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [threeChanceyBgMusicTrackIndex]);

  const playThreeChanceyBgMusicTrack = index => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const trackPath = threeChanceyBgMusicTracks[index];

    const newSound = new Sound(trackPath, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('error', error);
        return;
      }

      newSound.play(success => {
        if (success) {
          setThreeChanceyBgMusicTrackIndex(
            prevIndex => (prevIndex + 1) % threeChanceyBgMusicTracks.length,
          );
        } else {
          console.log('error');
        }
      });
      setSound(newSound);
    });
  };

  useFocusEffect(
    useCallback(() => {
      Platform.OS === 'android' && Orientation.lockToPortrait();

      return () => Orientation.unlockAllOrientations();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!quote || !category) return;
      const exists =
        savedQuotes[category]?.some(
          item => item.quote.original === quote.original,
        ) || false;
      setSaved(exists);
    }, [quote, category, savedQuotes]),
  );

  useEffect(() => {
    const setCharmBgMusic = async () => {
      try {
        const musicValue = await AsyncStorage.getItem('isOnMusic');
        const isBgMusicOn = JSON.parse(musicValue);
        setIsEnabledMusic(isBgMusicOn);
        if (sound) {
          sound.setVolume(isBgMusicOn ? volume : 0);
        }
      } catch (error) {
        console.error('Error', error);
      }
    };
    setCharmBgMusic();
  }, [sound, volume]);

  useEffect(() => {
    if (sound) sound.setVolume(isEnabledMusic ? volume : 0);
  }, [volume, isEnabledMusic]);

  const loadThreeChanceyBgMusic = async () => {
    try {
      const musicValue = await AsyncStorage.getItem('isOnMusic');
      const isBgMusicOn = JSON.parse(musicValue);
      setIsEnabledMusic(isBgMusicOn);
    } catch (error) {
      console.error('Error', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLastChanceyChoice();
      loadSavedQuotes();
      loadThreeChanceyNtf();
      loadThreeChanceyBgMusic();
      loadWeekIndicator();
    }, []),
  );

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

  const toggleSaveQuote = async () => {
    if (!quote || !category) return;

    try {
      const updated = { ...savedQuotes };
      const exists = updated[category]?.some(
        item => item.quote.original === quote.original,
      );

      if (exists) {
        updated[category] = updated[category].filter(
          item => item.quote.original !== quote.original,
        );
        setSaved(false);
        if (isEnabledNotifications) {
          Toast.show({ text1: 'Quote removed from saved!' });
        }
      } else {
        if (!updated[category]) updated[category] = [];
        updated[category].push({ quote, timestamp: Date.now() });
        setSaved(true);
        if (isEnabledNotifications) {
          Toast.show({ text1: 'Quote saved!' });
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
      console.log('Error', e);
    }
  };

  const checkLastChanceyChoice = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const now = Date.now();
        const diff = now - parsed.timestamp;

        if (diff < 24 * 60 * 60 * 1000) {
          setQuote(parsed.quote);
          setCategory(parsed.category);
          setShowRephrased(parsed.showRephrased || false);
          setLocked(true);
          setMessage('You have already made a choice today!');

          const updatedSavedQuotes = savedQuotes || {};
          const exists =
            updatedSavedQuotes[parsed.category]?.some(
              item => item.quote.original === parsed.quote.original,
            ) || false;
          setSaved(exists);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const shareChanseyQuote = async () => {
    if (!quote) return;
    try {
      await Share.share({
        message: showRephrased ? quote.rephrased : quote.original,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const shareDailyResult = async () => {
    try {
      await Share.share({
        message: `You haven't missed a day this week. Keep it up!`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const loadWeekIndicator = async () => {
    try {
      const savedWeekData = await AsyncStorage.getItem('THREE_CHANCEY_WEEK');
      const now = new Date();
      const dayOfWeek = (now.getDay() + 6) % 7;
      const startOfWeek = new Date();
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

      if (!savedWeekData) {
        const defaultDays = Array(DAYS_IN_WEEK).fill(DEFAULT_INDICATOR_COLOR);
        setWeekIndicator(defaultDays);
        await AsyncStorage.setItem(
          'THREE_CHANCEY_WEEK',
          JSON.stringify({
            weekStart: startOfWeek.getTime(),
            days: defaultDays,
          }),
        );
        return;
      }

      const weekData = JSON.parse(savedWeekData);
      if (new Date(weekData.weekStart) < startOfWeek) {
        const defaultDays = Array(DAYS_IN_WEEK).fill(DEFAULT_INDICATOR_COLOR);
        setWeekIndicator(defaultDays);
        await AsyncStorage.setItem(
          'THREE_CHANCEY_WEEK',
          JSON.stringify({
            weekStart: startOfWeek.getTime(),
            days: defaultDays,
          }),
        );
      } else {
        const days = Array(DAYS_IN_WEEK).fill(DEFAULT_INDICATOR_COLOR);
        if (weekData.days) {
          for (let i = 0; i < weekData.days.length; i++) {
            days[i] = weekData.days[i] || DEFAULT_INDICATOR_COLOR;
          }
        }
        setWeekIndicator(days);
      }
    } catch (e) {
      console.log('Error loading week indicator', e);
    }
  };

  const updateWeekIndicator = async cat => {
    try {
      const now = new Date();
      const dayOfWeek = (now.getDay() + 6) % 7;
      const weekKey = 'THREE_CHANCEY_WEEK';

      const savedWeekData = await AsyncStorage.getItem(weekKey);
      let weekData = savedWeekData ? JSON.parse(savedWeekData) : null;

      const startOfWeek = new Date();
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

      if (!weekData || new Date(weekData.weekStart) < startOfWeek) {
        weekData = {
          weekStart: startOfWeek.getTime(),
          days: Array(DAYS_IN_WEEK).fill(DEFAULT_INDICATOR_COLOR),
        };
      }

      weekData.days[dayOfWeek] = CATEGORY_COLORS[cat] || '#FFFFFF';
      await AsyncStorage.setItem(weekKey, JSON.stringify(weekData));

      const indicator = Array(DAYS_IN_WEEK).fill(DEFAULT_INDICATOR_COLOR);
      for (let i = 0; i <= dayOfWeek; i++) {
        indicator[i] = weekData.days[i] || DEFAULT_INDICATOR_COLOR;
      }
      setWeekIndicator(indicator);

      const allPreviousSelected = Array.from(
        { length: dayOfWeek },
        (_, i) => weekData.days[i] !== DEFAULT_INDICATOR_COLOR,
      ).every(v => v);

      if (allPreviousSelected && dayOfWeek > 0) {
        setChanceyModalVisible(true);
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const handleChanseyCategoryPress = async cat => {
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
    setShowRephrased(false);
    setMessage('Good choice!');

    const timestamp = Date.now();
    const data = {
      quote: randomQuote,
      category: cat,
      timestamp,
      saved: false,
      showRephrased: false,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      await updateWeekIndicator(cat);
    } catch (e) {
      console.log('Error', e);
    }
  };

  const handleRephraseQuote = async () => {
    if (!quote) return;

    const newShow = !showRephrased;
    setShowRephrased(newShow);

    const timestamp = Date.now();
    const data = {
      quote,
      category,
      timestamp,
      saved: false,
      showRephrased: newShow,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.log('Error saving quote state', e);
    }
  };

  const quoteContainerColor = category ? CATEGORY_COLORS[category] : '#FFFFFF';

  return (
    <ThreeChanceyBackground>
      <View
        style={[
          styles.chanseycontainer,
          Platform.OS === 'android' &&
            chanceyModalVisible && { filter: 'blur(2px)' },
        ]}
      >
        <LinearGradient
          colors={['#7C7C7C', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.chanseywlccontainer}>
            {Platform.OS === 'ios' ? (
              <Image
                source={require('../../assets/images/chanceymenulgo.png')}
                style={{ position: 'absolute', left: 12 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/chanceylogotrans.png')}
                style={{
                  position: 'absolute',
                  left: 12,
                  width: 80,
                  height: 65,
                }}
              />
            )}
            <Text style={styles.welcomeText}>Main menu</Text>
          </View>
        </LinearGradient>

        <View style={styles.chanceyindicator}>
          {weekIndicator.map((color, index) => (
            <View
              key={index}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: color,
              }}
            />
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 42 }}>
        {!quote ? (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.chanseymenucontainer,
                { backgroundColor: '#F04E2A' },
              ]}
              onPress={() => handleChanseyCategoryPress('Motivation')}
              disabled={locked}
            >
              <Text style={styles.menuText}>Motivation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.chanseymenucontainer,
                { backgroundColor: '#4D9BD2' },
              ]}
              onPress={() => handleChanseyCategoryPress('Productivity')}
              disabled={locked}
            >
              <Text style={styles.menuText}>Productivity</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.chanseymenucontainer,
                { backgroundColor: '#FFD848' },
              ]}
              onPress={() => handleChanseyCategoryPress('Mindfulness')}
              disabled={locked}
            >
              <Text style={styles.menuText}>Mindfulness</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={[
              styles.chanseyquotecontainer,
              { backgroundColor: quoteContainerColor },
            ]}
          >
            <Text style={styles.quoteText}>
              {showRephrased ? quote.rephrased : quote.original}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 50,
                gap: 15,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TouchableOpacity
                style={styles.rephrasebtn}
                onPress={handleRephraseQuote}
              >
                <Text style={styles.rephrasebtntxt}>Rephrase</Text>
              </TouchableOpacity>

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

              <TouchableOpacity onPress={shareChanseyQuote}>
                <Image source={require('../../assets/images/chanceyshr.png')} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.chanseymesscontainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        <View style={{ height: 250 }} />
      </View>

      <View style={{ position: 'absolute', bottom: 110, right: 47 }}>
        <Image source={require('../../assets/images/chanceyhm.png')} />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={chanceyModalVisible}
        onRequestClose={() => setChanceyModalVisible(false)}
        statusBarTranslucent={Platform.OS === 'android'}
      >
        {Platform.OS === 'ios' && (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            blurType="light"
            blurAmount={3}
          />
        )}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.66)',
          }}
        >
          <View
            style={{
              width: '70%',
              padding: 20,
              paddingVertical: 40,
              backgroundColor: '#fff',
              borderRadius: 50,
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#7C7C7C',
              borderBottomLeftRadius: 0,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '500', width: '80%' }}>
              You haven't missed a day this week. Keep it up!
            </Text>
          </View>

          <Image source={require('../../assets/images/chanceymodal.png')} />
          <View
            style={{
              flexDirection: 'row',
              gap: 14,
              position: 'absolute',
              bottom: 35,
            }}
          >
            <TouchableOpacity
              style={styles.modalbtn}
              activeOpacity={0.7}
              onPress={() => setChanceyModalVisible(false)}
            >
              <Text style={styles.modalbtntxt}>Ok</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalbtn}
              activeOpacity={0.7}
              onPress={shareDailyResult}
            >
              <Text style={styles.modalbtntxt}>Share</Text>
              <Image source={require('../../assets/images/modalsh.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThreeChanceyBackground>
  );
};

const styles = StyleSheet.create({
  chanseycontainer: { marginTop: height * 0.044 },
  headerGradient: {
    borderRadius: 30,
    width: '88%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  chanseywlccontainer: {
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
    fontSize: 19,
    textAlign: 'center',
    color: '#000',
  },
  chanseymenucontainer: {
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
  chanseymesscontainer: {
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
  chanseyquotecontainer: {
    width: '100%',
    paddingTop: 40,
    paddingHorizontal: 18,
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  quoteText: {
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
  rephrasebtn: {
    width: 140,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rephrasebtntxt: {
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  modalbtn: {
    width: 150,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalbtntxt: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  chanceyindicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 17,
    marginBottom: 10,
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 220,
    padding: 10,
    borderWidth: 5,
    alignSelf: 'center',
    borderColor: 'rgba(124, 124, 124, 0.7)',
  },
});

export default ThreeChanceyHomeScreen;
