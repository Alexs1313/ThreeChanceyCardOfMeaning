import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const ThreeChanceyOnboard = () => {
  const [currentChanceySlide, setCurrentChanceySlide] = useState(0);
  const navigation = useNavigation();

  const nextChanseySlide = () => {
    if (currentChanceySlide < 2) {
      setCurrentChanceySlide(currentChanceySlide + 1);
    } else {
      navigation.navigate('ThreeChanceyTabs');
    }
  };

  return (
    <ThreeChanceyBackground>
      <View style={styles.chanceycontainer}>
        <View style={styles.chanceywlccnt}>
          <Text style={styles.chanceywlctxt}>
            {currentChanceySlide === 0
              ? 'Your Daily Choice'
              : currentChanceySlide === 1
              ? 'Save What Speaks to You'
              : 'Start Your Ritual'}
          </Text>
          <Text style={styles.chanceywlcsbt}>
            {currentChanceySlide === 0
              ? `Each morning, you’ll see three hidden cards. Pick the one that feels
right — no logic, just intuition. Behind it, a thought made for you
today.`
              : currentChanceySlide === 1
              ? 'Every quote you open can be saved to one of your collections —Motivation, Productivity, or Calm. Build your personal deck of inspiration.'
              : 'One choice. Three chances. A new perspective every day. Ready to see what today holds?'}
          </Text>

          {currentChanceySlide > 0 && (
            <>
              {Platform.OS === 'ios' ? (
                <Image
                  source={require('../../assets/images/chanceyon2.1.png')}
                  style={{ position: 'absolute', top: -114 }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/chanceylogotrans.png')}
                  style={{
                    position: 'absolute',
                    top: -114,
                    width: 160,
                    height: 150,
                  }}
                />
              )}
            </>
          )}
        </View>
      </View>

      <View style={{ height: 450 }}></View>
      <View style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>
        {currentChanceySlide === 0 ? (
          <>
            <Image source={require('../../assets/images/chanceyon1.png')} />
            {Platform.OS === 'ios' ? (
              <Image
                source={require('../../assets/images/chanceyon1.1.png')}
                style={{ position: 'absolute', bottom: 200, right: -5 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/chanceylogotrans.png')}
                style={{
                  position: 'absolute',
                  bottom: 200,
                  right: -15,
                  width: 100,
                  height: 85,
                }}
              />
            )}
          </>
        ) : currentChanceySlide === 1 ? (
          <Image source={require('../../assets/images/chanceyon2.png')} />
        ) : (
          <Image source={require('../../assets/images/chanceyon3.png')} />
        )}
      </View>

      <TouchableOpacity
        style={styles.chanceybtn}
        activeOpacity={0.7}
        onPress={nextChanseySlide}
      >
        <Text style={styles.chanceybtntxt}>
          {currentChanceySlide === 0
            ? 'Next'
            : currentChanceySlide === 1
            ? 'Next'
            : 'Start'}
        </Text>
      </TouchableOpacity>
    </ThreeChanceyBackground>
  );
};

const styles = StyleSheet.create({
  chanceycontainer: {},
  chanceywlccnt: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.16,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#7C7C7C',
    borderRadius: 50,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingBottom: 47,
    alignSelf: 'center',
  },
  chanceywlctxt: {
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  chanceywlcsbt: {
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
    marginTop: 28,
  },
  chanceybtn: {
    width: '80%',
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    borderRadius: 30,
  },
  chanceybtntxt: {
    fontWeight: '700',
    fontSize: 20,
    color: '#000',
  },
});

export default ThreeChanceyOnboard;
