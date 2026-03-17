import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AuthNavigator, { AuthStackParamList } from './AuthNavigator';
import AdminTabs, { AdminTabParamList } from './AdminTabs';
import OrganizerTabs from './OrganizerTabs';
import ParticipantTabs from './ParticipantTabs';
import EventFormScreen from '../views/EventFormScreen/EventFormScreen';
import UserFormScreen from '../views/UserFormScreen/UserFormScreen';
import { Event, GenderType, FormatType } from '../models/Event';
import { UserRoleType } from '../models/User';
import { NavigatorScreenParams } from '@react-navigation/native';
import EventRegistrationScreen from '../views/EventRegistration/EventRegistrationScreen';
import EventDetailsScreen from '../views/EventDetailsScreen/EventDetailsScreen';
import CategoryDetailsScreen from '../views/CategoryDetailsScreen/CategoryDetailsScreen';
import { EventRequestResponse } from '../models/EventRequest';
import OperationTabs, { OperationTabParamList } from './OperationTab';
import EventRequestFormScreen from '../views/EventRequestFormScreen/EventRequestFormScreen';
import EventRequestDetailsScreen from '../views/EventRequestDetailsScreen/EventRequestDetailsScreen';
import NotificationScreen from '../views/NotificationScreen/NotificationScreen';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
  OperationTabs: NavigatorScreenParams<OperationTabParamList>;
  Notification : { audience: 'Ops' | 'Admin' };
  OrganizerTabs: undefined;
  ParticipantTabs: undefined;
  EventForm: {
    mode: 'create' | 'edit';
    event?: Event;
    onSubmit?: (event: Event) => void;
  };
  UserForm: { mode: 'create' } | { mode: 'edit'; userId: string };
  EventRegister: {
    eventId: string;
  };
  EventDetails: {
    eventId: string;
    role: UserRoleType;
  };
  CategoryDetails: {
    eventId: string;
    gender: GenderType;
    format: FormatType;
    role: UserRoleType;
    eventCategoryId?: number;
  };
  EventRequestDetails : {
      request: EventRequestResponse;
      role: UserRoleType;
    };
    EventRequestForm: {
    mode: 'create' | 'edit';
    request?: EventRequestResponse; 
    onSubmit?: (request: EventRequestResponse) => void; 
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
      <Stack.Screen name="OperationTabs" component={OperationTabs} />

      <Stack.Screen name="EventRequestForm" component={EventRequestFormScreen} />
      <Stack.Screen name="EventRequestDetails" component={EventRequestDetailsScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
