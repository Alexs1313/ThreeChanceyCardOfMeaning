import { Image, ImageBackground, Platform } from 'react-native';

const ThreeChanceyLoader = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/chanceybg.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      {Platform.OS === 'ios' ? (
        <Image source={require('../../assets/images/chanceyldr.png')} />
      ) : (
        <Image
          source={require('../../assets/images/chanceylogotrans.png')}
          style={{ width: 210, height: 180 }}
        />
      )}
    </ImageBackground>
  );
};

export default ThreeChanceyLoader;
