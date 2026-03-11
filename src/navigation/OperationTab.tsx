import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users } from 'lucide-react-native';
import { colors } from '../theme/colors';

import EventRequestListScreen from '../views/EventRequestListScreen/EventRequestListScreen';
import { fonts } from '../theme/fonts';
import OperationHomeScreen from '../views/Operation/OperationHomeScreen';

export type OperationTabParamList = {
  Home: undefined;
  Request: undefined;
};

const Tab = createBottomTabNavigator<OperationTabParamList>();

const OperationTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarSafeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          height: 80,
          paddingVertical: 10,
          backgroundColor: colors.cardBackgroud,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: fonts.subHeading,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Home') {
            return (
              <Home
                size={22}
                color={focused ? colors.primary : colors.textSecondary}
              />
            );
          }

          if (route.name === 'Request') {
            return (
              <Users
                size={22}
                color={focused ? colors.primary : colors.textSecondary}
              />
            );
          }

          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={OperationHomeScreen} />

      <Tab.Screen name="Request">
        {() => <EventRequestListScreen role="operations" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default OperationTabs;
