import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Users, ClipboardList } from 'lucide-react-native';
import { colors } from '../theme/colors';
import AdminHomeScreen from '../views/Admin/AdminHomeScreen';
import EventsListScreen from '../views/EventListScreen/EventsListScreen';
import EventRequestListScreen from '../views/EventRequestListScreen/EventRequestListScreen';
import { fonts } from '../theme/fonts';
import UsersListScreen from '../views/UsersListScreen/UsersListScreen';

export type AdminTabParamList = {
  Home: undefined;
  Events: undefined;
  Request: undefined;
  Users: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const AdminTabs = () => {
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
            return <Home size={22} color={focused ? colors.primary : colors.textSecondary} />;
          }
          if (route.name === 'Events') {
            return <Calendar size={22} color={focused ? colors.primary : colors.textSecondary} />;
          }
          if (route.name === 'Request') {
            return <ClipboardList size={22} color={focused ? colors.primary : colors.textSecondary} />;
          }
          if (route.name === 'Users') {
            return <Users size={22} color={focused ? colors.primary : colors.textSecondary} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={AdminHomeScreen} />
      <Tab.Screen name="Events">
        {() => <EventsListScreen role="admin" />}
      </Tab.Screen>
      <Tab.Screen name="Request">
        {() => <EventRequestListScreen role="admin" />}
      </Tab.Screen>
      <Tab.Screen name="Users" component={UsersListScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabs;