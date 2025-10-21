import React, { useCallback } from 'react';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import LinearGradient from 'react-native-linear-gradient';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../ThreeChanseyStore/ThreeChanseyContext';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const { height } = Dimensions.get('window');

const ThreeChanceySettings = () => {
  const {
    isEnabledNotifications,
    setIsEnabledNotifications,
    isEnabledMusic,
    setIsEnabledMusic,
    loadChanceyProfile,
    chanceyProfileName,
    chanceyProfileImage,
    setChanceyProfileName,
    setChanceyProfileImage,
  } = useStore();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadChanceyProfile();
    }, []),
  );

  const deleteChanceyProfile = async () => {
    await AsyncStorage.removeItem('chanceyCreateProfile');

    setChanceyProfileName('');
    setChanceyProfileImage(null);
    navigation.navigate('ThreeChanceyOnboard');
  };

  const toggleThreeChanceyNtf = async value => {
    Toast.show({
      text1: !isEnabledNotifications
        ? 'Notifications Enabled!'
        : 'Notifications Disabled!',
    });
    try {
      await AsyncStorage.setItem('isOnNotification', JSON.stringify(value));

      setIsEnabledNotifications(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const toggleThreeChanceyMusic = async value => {
    try {
      await AsyncStorage.setItem('isOnMusic', JSON.stringify(value));
      setIsEnabledMusic(value);
    } catch (error) {
      console.log('Error', error);
    }
  };

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
            <Text style={styles.threechanceyWelcomeText}>Settings</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.threechanceyMessageContainer}
          onPress={() => toggleThreeChanceyNtf(!isEnabledNotifications)}
        >
          <Text style={styles.threechanceyMessageText}>Notifications</Text>
          {isEnabledNotifications ? (
            <Image source={require('../../assets/images/chanceynot.png')} />
          ) : (
            <Image source={require('../../assets/images/chanceynotin.png')} />
          )}
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.threechanceyMessageContainer]}
              onPress={() => toggleThreeChanceyMusic(!isEnabledMusic)}
            >
              <Text style={styles.threechanceyMessageText}>Music</Text>
              {isEnabledMusic ? (
                <Image
                  source={require('../../assets/images/copsncuffssndon.png')}
                  style={{ width: 35, height: 35, left: 3, opacity: 0.6 }}
                />
              ) : (
                <Image
                  source={require('../../assets/images/copsncuffssndoff.png')}
                  style={{ width: 35, height: 35, left: 3, opacity: 0.6 }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.threechanceyMessageContainer,
                { marginBottom: 20 },
              ]}
              onPress={() =>
                Linking.openURL(
                  'https://apps.apple.com/us/app/three-chancey-paths/id6753937423',
                )
              }
            >
              <Text style={styles.threechanceyMessageText}>Share app</Text>
              <Image source={require('../../assets/images/chanceyshr.png')} />
            </TouchableOpacity>
          </>
        )}

        <View
          activeOpacity={0.8}
          style={[styles.threechanceyProfileContainer, { marginBottom: 200 }]}
        >
          <Image
            source={{ uri: chanceyProfileImage }}
            style={{ width: 120, height: 120, borderRadius: 12 }}
          />

          <View style={{ flex: 1, alignItems: 'center', width: '60%' }}>
            <Text style={[styles.threechanceyMessageText]}>
              Hello, {chanceyProfileName}!
            </Text>

            <TouchableOpacity
              style={styles.chanceybtn}
              activeOpacity={0.7}
              onPress={deleteChanceyProfile}
            >
              <Text style={styles.chanceybtntxt}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#7C7C7C',
    borderRadius: 30,
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 35,
  },
  threechanceyMessageText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
  },
  threechanceyProfileContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#7C7C7C',
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 25,
    padding: 14,
    gap: 12,
    borderBottomRightRadius: 0,
  },
  chanceybtn: {
    width: 100,
    height: 40,
    backgroundColor: '#CE0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 12,
  },
  chanceybtntxt: {
    fontWeight: '700',
    fontSize: 14,
    color: '#fff',
  },
});

export default ThreeChanceySettings;
