import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import { useStore } from '../ThreeChanseyStore/ThreeChanseyContext';
import LinearGradient from 'react-native-linear-gradient';
import ThreeChanceyCrsl from '../ThreeChanceyComponents/ThreeChanceyCrsl';
import { useFocusEffect } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const CATEGORY_COLORS = {
  Motivation: '#F04E2A',
  Productivity: '#4D9BD2',
  Mindfulness: '#FFD848',
};

const ThreeChanceySaved = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { loadSavedQuotes, savedQuotes } = useStore();

  useFocusEffect(
    useCallback(() => {
      loadSavedQuotes();
    }, []),
  );

  const chanseyQuotesCategory =
    selectedCategory && savedQuotes[selectedCategory]
      ? savedQuotes[selectedCategory].map(item => ({
          descr: item.quote,
          category: selectedCategory,
        }))
      : [];

  return (
    <ThreeChanceyBackground>
      <View style={styles.chanceycontainer}>
        <LinearGradient
          colors={['#7C7C7C', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.chanceywlccnt}>
            <Image
              source={require('../../assets/images/chanceymenulgo.png')}
              style={{ position: 'absolute', left: 12 }}
            />
            <Text style={styles.chanceywlctxt}>
              {selectedCategory ? selectedCategory : 'Saved'}
            </Text>
          </View>
        </LinearGradient>
        <View style={{}}>
          {!selectedCategory ? (
            <View style={{ marginTop: 110, paddingHorizontal: 42 }}>
              {Object.keys(CATEGORY_COLORS).map(cat => (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.7}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: CATEGORY_COLORS[cat] },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                style={{ marginTop: 22, marginBottom: 56, paddingLeft: 42 }}
              >
                <Image
                  source={require('../../assets/images/chanceyback.png')}
                />
              </TouchableOpacity>

              {chanseyQuotesCategory.length > 0 ? (
                <ThreeChanceyCrsl
                  chanseyQuotesCategory={chanseyQuotesCategory}
                  selectedCategory={selectedCategory}
                  onSelect={item => alert(`Selected: ${item.descr}`)}
                />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 50,
                    fontSize: 18,
                    color: '#fff',
                    marginBottom: 120,
                  }}
                >
                  No saved quotes in this category
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </ThreeChanceyBackground>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    borderBottomLeftRadius: 0,
    height: 108,
  },
  categoryText: {
    fontWeight: '800',
    fontSize: 24,
    color: '#fff',
  },
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
  chanceycontainer: { marginTop: height * 0.044, paddingBottom: 140 },
  headerGradient: {
    borderRadius: 30,
    width: '88%',
    alignSelf: 'center',
  },
  chanceywlccnt: {
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 27,
    height: 86,
    alignSelf: 'center',
    margin: 4,
  },
  chanceywlctxt: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
});

export default ThreeChanceySaved;
