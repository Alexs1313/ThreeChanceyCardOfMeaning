import { createStackNavigator } from '@react-navigation/stack';
import ThreeChanceyTabs from './ThreeChanceyTabs';
import ThreeChanceyOnboard from '../ThreeChanceyScreens/ThreeChanceyOnboard';

const Stack = createStackNavigator();

const ThreeChanceyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ThreeChanceyOnboard"
        component={ThreeChanceyOnboard}
      />
      <Stack.Screen name="ThreeChanceyTabs" component={ThreeChanceyTabs} />
    </Stack.Navigator>
  );
};

export default ThreeChanceyStack;
