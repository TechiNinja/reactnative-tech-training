import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { EventProvider } from './src/store/EventStore';
import { UserProvider } from './src/store/UserStore';
import { AuthProvider } from './src/store/AuthStore';
import { EventRequestProvider } from './src/store/EventRequestStore';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <UserProvider>
          <EventRequestProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </EventRequestProvider>
        </UserProvider>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
