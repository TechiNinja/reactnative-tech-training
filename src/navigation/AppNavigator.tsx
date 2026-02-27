import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import AdminTabs from './AdminTabs';
import OrganizerTabs from './OrganizerTabs';
import ParticipantTabs from './ParticipantTabs';
import EventFormScreen from '../views/EventFormScreen/EventFormScreen';
import UserFormScreen from '../views/UserFormScreen/UserFormScreen';
import { Event, GenderType, FormatType } from '../models/Event';
import { User } from '../models/User';
import { NavigatorScreenParams } from '@react-navigation/native';
import EventRegistrationScreen from '../views/EventRegistration/EventRegistrationScreen';
import EventDetailsScreen from '../views/EventDetailsScreen/EventDetailsScreen';
import CategoryDetailsScreen from '../views/CategoryDetailsScreen/CategoryDetailsScreen';
import { RoleType } from '../constants/Roles';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AdminTabs: undefined;
  OrganizerTabs: undefined;
  ParticipantTabs: undefined;
  EventForm: {
    mode: 'create' | 'edit';
    event?: Event;
    onSubmit?: (event: Event) => void;
  };
  UserForm: {
    mode: 'create' | 'edit';
    user?: User;
  };
  EventRegister: {
    eventId: string;
  };
  EventDetails: {
    eventId: string;
    role: RoleType;
  };
  CategoryDetails: {
    eventId: string;
    gender: GenderType;
    format: FormatType;
    role: RoleType;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />

      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="OrganizerTabs" component={OrganizerTabs} />
      <Stack.Screen name="ParticipantTabs" component={ParticipantTabs} />

      <Stack.Screen name="EventForm" component={EventFormScreen} />
      <Stack.Screen name="UserForm" component={UserFormScreen} />
      <Stack.Screen name="EventRegister" component={EventRegistrationScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
