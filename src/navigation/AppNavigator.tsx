import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import AdminTabs, { AdminTabParamList } from './AdminTabs';
import OrganizerTabs from './OrganizerTabs';
import ParticipantTabs from './ParticipantTabs';
import EventFormScreen from '../views/EventFormScreen/EventFormScreen';
import UserFormScreen from '../views/UserFormScreen/UserFormScreen';
import EventRequestFormScreen from '../views/EventRequestFormScreen/EventRequestFormScreen';
import { GenderType, FormatType } from '../models/Event';
import { UserRoleType } from '../models/User';
import { NavigatorScreenParams } from '@react-navigation/native';
import EventRegistrationScreen from '../views/EventRegistration/EventRegistrationScreen';
import EventDetailsScreen from '../views/EventDetailsScreen/EventDetailsScreen';
import CategoryDetailsScreen from '../views/CategoryDetailsScreen/CategoryDetailsScreen';
import { RoleType } from '../constants/Roles';
import { EventRequestResponse } from '../models/EventRequest';
import EventRequestDetailsScreen from '../views/EventRequestDetailsScreen/EventRequestDetailsScreen';
import { EventResponse } from '../models/EventResponse';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  OrganizerTabs: undefined;
  ParticipantTabs: undefined;
  EventForm: {
    mode: 'create' | 'edit';
    event?: EventResponse;
    eventRequest?: EventRequestResponse;
  };
  UserForm: { mode: 'create' } | { mode: 'edit'; userId: string };
  EventRequestForm: {
    mode: 'create' | 'edit';
    request?: EventRequestResponse;
    onSubmit?: (request: EventRequestResponse) => void;
  };
  EventRegister: {
    eventId: string;
  };
  EventDetails: {
    eventId: string;
    role: RoleType;
  };
  EventRequestDetails: {
    request: EventRequestResponse;
    role: RoleType;
  };
  CategoryDetails: {
    eventId: string;
    gender: GenderType;
    format: FormatType;
    role: UserRoleType;
    eventCategoryId?: number;
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
      <Stack.Screen name="EventRequestForm" component={EventRequestFormScreen} />
      <Stack.Screen name="EventRegister" component={EventRegistrationScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="EventRequestDetails" component={EventRequestDetailsScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;