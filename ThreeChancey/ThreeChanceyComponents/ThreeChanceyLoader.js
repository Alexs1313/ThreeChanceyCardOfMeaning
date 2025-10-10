import { Image, ImageBackground } from 'react-native';

const ThreeChanceyLoader = () => {
  return (
    <ImageBackground
      source={require('../../assets/images/chanceybg.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Image source={require('../../assets/images/chanceyldr.png')} />
    </ImageBackground>
  );
};

export default ThreeChanceyLoader;
