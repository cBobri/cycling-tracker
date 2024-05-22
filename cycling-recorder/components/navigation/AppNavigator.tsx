import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthScreen from '@components/auth/AuthScreen';
import LoginScreen from '@components/auth/LoginScreen';
import RegisterScreen from '@components/auth/RegisterScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen} 
        options={{ headerShown: true }} 
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
  
  export default AppNavigator;
