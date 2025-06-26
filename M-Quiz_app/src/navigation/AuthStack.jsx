import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GuestJoinScreen from '../screens/auth/GuestJoinScreen'; // <-- Import the new screen

const Stack = createNativeStackNavigator();

/**
 * AuthStack now includes the GuestJoinScreen.
 */
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="GuestJoin" component={GuestJoinScreen} /> 
  </Stack.Navigator>
);

export default AuthStack;