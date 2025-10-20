import React from 'react';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import LinearGradient from 'react-native-linear-gradient';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

const ThreeChanceyInfo = () => {
  return (
    <ThreeChanceyBackground>
      <View style={styles.threechanceyContainer}>
        <LinearGradient
          colors={['#7C7C7C', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.threechanceyHeaderGradient}
        >
          <View style={styles.threechanceyWelcomeContainer}>
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
            <Text style={styles.threechanceyWelcomeText}>About</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.threechanceyMessageContainer}>
          <Text style={styles.threechanceyMessageText}>
            {Platform.OS === 'ios'
              ? `Three Chancey is a daily ritual of choice. Every day you see three
cards face down. Choose one and receive a quote, thought, or
inspiration that is specific to that day. Save your favorite sayings
in the Motivation, Productivity, or Calm sections, and return to
them when you need peace or inspiration.`
              : `Three Crown Paths is a daily ritual of choice. Every day you see three
cards face down. Choose one and receive a quote, thought, or
inspiration that is specific to that day. Save your favorite sayings
in the Motivation, Productivity, or Calm sections, and return to
them when you need peace or inspiration.`}
          </Text>
        </View>

        <View style={{ height: 450 }} />
      </View>

      <View style={{ position: 'absolute', bottom: 110, alignSelf: 'center' }}>
        <Image source={require('../../assets/images/chanceyinfoim.png')} />
      </View>
    </ThreeChanceyBackground>
  );
};

const styles = StyleSheet.create({
  threechanceyContainer: { marginTop: height * 0.044 },
  threechanceyHeaderGradient: {
    borderRadius: 30,
    width: '88%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  threechanceyWelcomeContainer: {
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 27,
    height: 86,
    alignSelf: 'center',
    margin: 4,
  },
  threechanceyWelcomeText: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  threechanceyMessageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#7C7C7C',
    borderRadius: 50,
    borderBottomRightRadius: 0,
    padding: 20,
  },
  threechanceyMessageText: {
    fontWeight: '500',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default ThreeChanceyInfo;
