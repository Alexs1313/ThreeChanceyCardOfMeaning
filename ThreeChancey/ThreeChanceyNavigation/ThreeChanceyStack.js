import { createStackNavigator } from '@react-navigation/stack';
import ThreeChanceyTabs from './ThreeChanceyTabs';
import ThreeChanceyOnboard from '../ThreeChanceyScreens/ThreeChanceyOnboard';
import ThreeChanceyAccount from '../ThreeChanceyScreens/ThreeChanceyAccount';

const Stack = createStackNavigator();

const ThreeChanceyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ThreeChanceyOnboad" component={ThreeChanceyOnboad} />
      <Stack.Screen
        name="ThreeChanceyAccount"
        component={ThreeChanceyAccount}
      />
      <Stack.Screen name="ThreeChanceyTabs" component={ThreeChanceyTabs} />
    </Stack.Navigator>
  );
};

export default ThreeChanceyStack;
