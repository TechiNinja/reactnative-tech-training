import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar } from 'lucide-react-native';
import { colors } from '../theme/colors';
import ParticipantHomeScreen from '../views/Participant/ParticipantHomeScreen';
import EventsListScreen from '../views/EventListScreen/EventsListScreen';
import { fonts } from '../theme/fonts';

const Tab = createBottomTabNavigator();

const ParticipantTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarSafeAreaInsets: { bottom: 0 },
        tabBarStyle: {
          height: 80,
          paddingVertical: 10,
          backgroundColor: colors.cardBackgroud,
          borderTopColor: colors.border,
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
            return <Home size={22} color={focused ? colors.primary : colors.textSecondary} />;
          }
          if (route.name === 'Events') {
            return <Calendar size={22} color={focused ? colors.primary : colors.textSecondary} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={ParticipantHomeScreen} />
      <Tab.Screen name="Events">
        {() => <EventsListScreen role="participant" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default ParticipantTabs;