import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import ONLY the screens a guest needs
import GuestJoinScreen from '../screens/auth/GuestJoinScreen';
import GameLobbyScreen from '../screens/game/GameLobbyScreen';
import QuizScreen from '../screens/game/QuizScreen';
import ResultsScreen from '../screens/game/ResultsScreen';

const Stack = createNativeStackNavigator();

/**
 * GuestStack defines a completely separate and streamlined navigation flow
 * for players who join without an account. They will never see the bottom tabs.
 */
const GuestStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* The entry point for a guest is the join screen */}
    <Stack.Screen name="GuestJoin" component={GuestJoinScreen} />
    
    {/* The rest of the game flow */}
    <Stack.Screen name="GameLobby" component={GameLobbyScreen} />
    <Stack.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ gestureEnabled: false }}
    />
    <Stack.Screen 
        name="Results" 
        component={ResultsScreen} 
        options={{ gestureEnabled: false }}
    />
  </Stack.Navigator>
);

export default GuestStack;