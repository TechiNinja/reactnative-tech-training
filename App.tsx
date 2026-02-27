import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { EventProvider } from './src/store/EventStore';
import { UserProvider } from './src/store/UserStore';
import { AuthProvider } from './src/store/AuthStore';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <UserProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
