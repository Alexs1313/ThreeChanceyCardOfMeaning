import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import ThreeChanceyStack from './ThreeChancey/ThreeChanceyNavigation/ThreeChanceyStack';
import { ContextProvider } from './ThreeChancey/ThreeChanseyStore/ThreeChanseyContext';
import Toast from 'react-native-toast-message';
import ThreeChanceyLoader from './ThreeChancey/ThreeChanceyComponents/ThreeChanceyLoader';

const App = () => {
  const [showWelcomeThreeChanceyScreen, setShowWelcomeThreeChanceyScreen] =
    useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowWelcomeThreeChanceyScreen(true);
    }, 5000);
  }, []);

  return (
    <NavigationContainer>
      <ContextProvider>
        {showWelcomeThreeChanceyScreen ? (
          <ThreeChanceyStack />
        ) : (
          <ThreeChanceyLoader />
        )}
      </ContextProvider>
      <Toast position="top" topOffset={50} />
    </NavigationContainer>
  );
};

export default App;
