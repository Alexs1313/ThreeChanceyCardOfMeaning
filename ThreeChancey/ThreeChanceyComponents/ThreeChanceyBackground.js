import { ImageBackground, ScrollView } from 'react-native';

const ThreeChanceyBackground = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/chanceyappbg.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

export default ThreeChanceyBackground;
