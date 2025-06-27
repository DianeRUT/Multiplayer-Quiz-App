import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/auth/AuthScreen';
import GuestStack from './GuestStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
      name="Auth" 
      component={AuthScreen}
      initialParams={{ mode: 'login' }}
    />
    <Stack.Screen name="GuestFlow" component={GuestStack} />
  </Stack.Navigator>
);

export default AuthStack;