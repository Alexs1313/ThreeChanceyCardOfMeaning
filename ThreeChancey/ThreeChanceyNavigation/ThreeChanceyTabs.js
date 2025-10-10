import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import ThreeChanceyHome from '../ThreeChanceyScreens/ThreeChanceyHome';
import ThreeChanceySaved from '../ThreeChanceyScreens/ThreeChanceySaved';
import ThreeChanceyInfo from '../ThreeChanceyScreens/ThreeChanceyInfo';
import ThreeChanceySettings from '../ThreeChanceyScreens/ThreeChanceySettings';

const Tab = createBottomTabNavigator();

const ThreeChanceyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.funnybirdstab,
        tabBarActiveTintColor: '#FF0000',
        tabBarInactiveTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="ThreeChanceyHome"
        component={ThreeChanceyHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/icons/chanceyusact.png')}
                />
              ) : (
                <Image source={require('../../assets/icons/chanceyus.png')} />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="ThreeChanceySaved"
        component={ThreeChanceySaved}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/icons/chanceysvact.png')}
                />
              ) : (
                <Image source={require('../../assets/icons/chanceysv.png')} />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="ThreeChanceyInfo"
        component={ThreeChanceyInfo}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/icons/chanceyaboutact.png')}
                />
              ) : (
                <Image
                  source={require('../../assets/icons/chanceyabout.png')}
                />
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="ThreeChanceySettings"
        component={ThreeChanceySettings}
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Image
                  source={require('../../assets/icons/chanceysettact.png')}
                />
              ) : (
                <Image source={require('../../assets/icons/chanceysett.png')} />
              )}
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  funnybirdstab: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopWidth: 3,
    elevation: 0,
    paddingTop: 28,
    height: 127,
    borderWidth: 2,
    borderColor: '#7C7C7C',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#fff',
  },
});

export default ThreeChanceyTabs;
