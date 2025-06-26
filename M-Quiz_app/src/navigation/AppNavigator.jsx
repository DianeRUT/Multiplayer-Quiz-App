import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import AuthStack from './AuthStack';
import MainAppTabs from './MainAppTabs';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

const AppNavigator = () => {
  const { token, isLoading } = useAuth();
  const { gameState, resetGame } = useGame();
  const navigationRef = useRef();

  /**
   * FINAL CORRECTED useEffect
   * 1. It now depends on the entire `gameState` object. This ensures it always
   *    has the latest version of all properties (pin, status, players).
   * 2. It has a rock-solid check for `gameState.players`.
   */
  useEffect(() => {
    if (navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (!currentRoute) return;

      const currentRouteName = currentRoute.name;

      if (gameState.status === 'lobby' && currentRouteName !== 'GameLobby') {
        // **THE DEFINITIVE FIX IS HERE**
        // Before navigating, we ensure that the players array exists and is not empty.
        // This prevents the race condition where the effect runs before the state is fully set.
        if (gameState.players && gameState.players.length > 0) {
          const isHost = gameState.players[0].id === token;
          navigationRef.current.navigate('GameLobby', { pin: gameState.pin, isHost });
        }
      }
      else if (gameState.status === 'in-progress' && currentRouteName !== 'Quiz') {
        navigationRef.current.navigate('Quiz');
      }
      else if (gameState.status === 'results' && currentRouteName !== 'Results') {
        navigationRef.current.navigate('Results');
      }
    }
  }, [gameState]); // <-- Dependency is the whole object now.

  const onStateChange = () => {
    if (!navigationRef.current) return;
    const currentRoute = navigationRef.current.getCurrentRoute();
    if (!currentRoute) return;

    const onGameScreen = ['GameLobby', 'Quiz', 'Results'].includes(currentRoute.name);
    if (!onGameScreen && gameState.status !== 'idle') {
      resetGame();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
      {token ? <MainAppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;