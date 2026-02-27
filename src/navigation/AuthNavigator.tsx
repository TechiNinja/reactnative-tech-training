import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../views/Login/LoginScreen';
import RegisterScreen from '../views/Register/RegisterScreen';
// import RoleSelectionScreen from '../views/RoleSelection/RoleSelectionScreen';
import ForgotPasswordScreen from '../views/ForgotPassword/ForgotPasswordScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  RoleSelection: {
    name: string;
    email: string;
    password: string;
  };
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      {/* <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} /> */}
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
