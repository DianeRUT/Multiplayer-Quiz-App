import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { GameProvider } from './src/context/GameContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GameProvider>
          <StatusBar barStyle="light-content" />
          <AppNavigator />
        </GameProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}