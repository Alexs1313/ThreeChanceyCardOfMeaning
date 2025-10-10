import React, { useRef } from 'react';
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

const CATEGORY_COLORS = {
  Motivation: '#F04E2A',
  Productivity: '#4D9BD2',
  Mindfulness: '#FFD848',
};

export default function ThreeChanceyCrsl({
  chanseyQuotesCategory = [],
  selectedCategory,
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;
  const ITEM_WIDTH = Math.round(SCREEN_WIDTH * (isLandscape ? 0.73 : 0.75));
  const ITEM_SPACING = Math.round((SCREEN_WIDTH - ITEM_WIDTH) / 2);

  const shareChanseyQuote = async quote => {
    try {
      await Share.share({
        message: quote,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
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
      {chanseyQuotesCategory.map((item, index) => {
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
          <View key={index}>
            <Animated.View
              style={[
                {
                  width: ITEM_WIDTH,
                  transform: [{ scale }, { translateY }],
                  opacity,
                },
              ]}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  key={index}
                  style={[
                    styles.quoteContainer,
                    { backgroundColor: CATEGORY_COLORS[selectedCategory] },
                  ]}
                >
                  <Text style={styles.quoteText}>{item.descr}</Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{ marginTop: 50 }}
                    onPress={() => shareChanseyQuote(item.descr)}
                  >
                    <Image
                      source={require('../../assets/images/chanceyshr.png')}
                    />
                  </TouchableOpacity>
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
