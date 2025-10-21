import React, { useCallback, useState } from 'react';
import ThreeChanceyBackground from '../ThreeChanceyComponents/ThreeChanceyBackground';
import LinearGradient from 'react-native-linear-gradient';
import { useStore } from '../ThreeChanseyStore/ThreeChanseyContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
} from 'react-native';

const { height } = Dimensions.get('window');

const ThreeChanceyAccount = () => {
  const { loadSavedQuotes } = useStore();
  const [chanceyInputName, setChanceyInputName] = useState('');
  const [chanceyInputImage, setChanceyInputImage] = useState('');
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadSavedQuotes();
    }, []),
  );

  const saveCharmProfile = async (name, image) => {
    try {
      const data = { name, image };
      await AsyncStorage.setItem('chanceyCreateProfile', JSON.stringify(data));
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleProfileChange = text => {
    setChanceyInputName(text);
    saveCharmProfile(text, chanceyInputImage);
    navigation.replace('ThreeChanceyTabs');
  };

  const ChanceyPicker = () => {
    const options = {
      mediaType: 'photo',
      maxHeight: 700,
      maxWidth: 700,
      quality: 0.8,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) return;
      const uri = response?.assets?.[0]?.uri;
      if (uri) {
        setChanceyInputImage(uri);
        saveCharmProfile(chanceyInputName, uri);
      }
    });
  };

  return (
    <ThreeChanceyBackground>
      <View style={styles.chanseycontainer}>
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
            <Text style={styles.welcomeText}>Create profile</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.chanseymesscontainer}>
          <TouchableOpacity
            style={styles.chanseypickercontainer}
            activeOpacity={0.7}
            onPress={ChanceyPicker}
          >
            {chanceyInputImage ? (
              <Image
                source={{ uri: chanceyInputImage }}
                style={{ width: 130, height: 130, borderRadius: 12 }}
              />
            ) : (
              <Image
                source={require('../../assets/images/chanceyadd.png')}
                style={{ width: 30, height: 30 }}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.messageText}>Tap to add photo</Text>

          <TextInput
            style={styles.chanceyinpt}
            value={chanceyInputName}
            onChangeText={setChanceyInputName}
            placeholder="Enter your name"
            placeholderTextColor="#7C7C7C"
          />

          {/* <View
            style={{
              alignItems: 'flex-end',
              marginTop: 10,
            }}
          >
            <Image source={require('../../assets/images/chanceyhm.png')} />
          </View> */}
        </View>

        {chanceyInputImage && chanceyInputName && (
          <TouchableOpacity
            style={styles.chanceybtn}
            activeOpacity={0.7}
            onPress={() =>
              handleProfileChange(chanceyInputName, chanceyInputImage)
            }
          >
            <Text style={styles.chanceybtntxt}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
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
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  chanseymesscontainer: {
    width: '100%',
    justifyContent: 'center',
    marginTop: height * 0.04,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#7C7C7C',
    borderRadius: 50,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingVertical: 40,
  },
  messageText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  chanseypickercontainer: {
    width: 130,
    height: 130,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#7C7C7C',
    alignSelf: 'center',
  },
  chanceyinpt: {
    width: '80%',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#7C7C7C',
    borderRadius: 12,
    marginTop: 20,
    padding: 10,
    textAlignVertical: 'top',
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  chanceybtn: {
    width: '50%',
    height: 60,
    backgroundColor: '#ffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 30,
  },
  chanceybtntxt: {
    fontWeight: '700',
    fontSize: 20,
    color: '#000',
  },
});

export default ThreeChanceyAccount;
