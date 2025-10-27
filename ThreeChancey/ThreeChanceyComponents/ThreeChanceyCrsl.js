import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Text,
  Share,
  Alert,
} from 'react-native';
import { useStore } from '../ThreeChanseyStore/ThreeChanseyContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const CATEGORY_COLORS = {
  Motivation: '#F04E2A',
  Productivity: '#4D9BD2',
  Mindfulness: '#FFD848',
};
const SAVED_QUOTES_KEY = 'THREE_CHANCEY_SAVED_QUOTES';

export default function ThreeChanceySaved() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;
  const ITEM_WIDTH = Math.round(SCREEN_WIDTH * (isLandscape ? 0.73 : 0.75));
  const ITEM_SPACING = Math.round((SCREEN_WIDTH - ITEM_WIDTH) / 2);
  const { savedQuotes, setSavedQuotes, isEnabledNotifications } = useStore();
  const [flatQuotes, setFlatQuotes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const quotesArray = [];
      if (savedQuotes) {
        Object.keys(savedQuotes).forEach(category => {
          const catQuotes = savedQuotes[category] || [];
          catQuotes.forEach(item => {
            if (item?.quote?.original) {
              quotesArray.push({ ...item, category });
            }
          });
        });
      }
      setFlatQuotes(quotesArray);
    }, [savedQuotes]),
  );

  const shareChanseyQuote = async item => {
    try {
      await Share.share({
        message: item._showRephrased
          ? item.quote.rephrased
          : item.quote.original,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const toggleSaveQuote = async item => {
    if (!item || !item.category || !item.quote) return;

    const cat = item.category;
    const text = item.quote.rephrased || item.quote.original;

    try {
      const updated = { ...savedQuotes };
      const exists = updated[cat]?.some(
        q => (q.quote.rephrased || q.quote.original) === text,
      );

      if (exists) {
        updated[cat] = updated[cat].filter(
          q => (q.quote.rephrased || q.quote.original) !== text,
        );
        if (isEnabledNotifications)
          Toast.show({ text1: 'Quote removed from saved!' });
      } else {
        if (!updated[cat]) updated[cat] = [];
        updated[cat].push({ ...item, timestamp: Date.now() });
        if (isEnabledNotifications) Toast.show({ text1: 'Quote saved!' });
      }

      setSavedQuotes(updated);
      await AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updated));

      const quotesArray = [];
      Object.keys(updated).forEach(category => {
        updated[category].forEach(it => quotesArray.push({ ...it, category }));
      });
      setFlatQuotes(quotesArray);
    } catch (e) {
      console.log('Error', e);
    }
  };

  const handleRephraseQuote = item => {
    if (!item || !item.category || !item.quote) return;

    setFlatQuotes(prev =>
      prev.map(q => {
        if (
          q.category === item.category &&
          q.quote.original === item.quote.original
        ) {
          return {
            ...q,
            _showRephrased: !q._showRephrased,
          };
        }
        return q;
      }),
    );
  };

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true },
      )}
      scrollEventThrottle={16}
    >
      {flatQuotes.map((item, index) => {
        const key = item._key || index;
        const inputRange = [
          (index - 1) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1, 0.8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1, 0.8],
          extrapolate: 'clamp',
        });
        const translateY = scrollX.interpolate({
          inputRange,
          outputRange: [12, 0, 12],
          extrapolate: 'clamp',
        });

        return (
          <View key={key}>
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                transform: [{ scale }, { translateY }],
                opacity,
              }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View
                  style={[
                    styles.quoteContainer,
                    { backgroundColor: CATEGORY_COLORS[item.category] },
                  ]}
                >
                  <Text style={styles.quoteText}>
                    {item._showRephrased
                      ? item.quote.rephrased
                      : item.quote.original}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 15,
                      marginTop: 50,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.rephrasebtn}
                      onPress={() => handleRephraseQuote(item)}
                    >
                      <Text style={styles.rephrasebtntxt}>Rephrase</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleSaveQuote(item)}>
                      <Image
                        source={require('../../assets/images/chanceysavedquo.png')}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => shareChanseyQuote(item)}>
                      <Image
                        source={require('../../assets/images/chanceyshr.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  quoteContainer: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
});
