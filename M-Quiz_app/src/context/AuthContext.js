import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socketService } from '../services/socketService';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userDataString = await AsyncStorage.getItem('userData');
        if (userToken && userDataString) {
          setToken(userToken);
          setUser(JSON.parse(userDataString));
          socketService.connect(userToken);
        }
      } catch (e) { console.error('AuthContext: Failed to restore token.', e); }
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const login = async (credentials) => {
    const { token: newToken, user: newUser } = await authService.login(credentials);
    setUser(newUser);
    setToken(newToken);
    await AsyncStorage.setItem('userToken', newToken);
    await AsyncStorage.setItem('userData', JSON.stringify(newUser));
    socketService.connect(newToken);
  };
  
  const register = async (registerData) => await authService.register(registerData);
  
  /**
   * NEW: Function to start a guest session.
   * It creates a temporary user object and connects to the socket without a token.
   */
  const startGuestSession = (nickname) => {
    // A simple way to create a unique enough ID for the session
    const guestId = `guest_${Date.now()}`; 
    const guestUser = {
        id: guestId,
        name: nickname,
        role: 'GUEST', // A new role to identify guest players
    };
    setUser(guestUser);
    setToken(guestId); // Use the guestId as a temporary "token" to satisfy logic checks
    
    // Connect to the socket without a JWT token.
    // The backend socket server MUST be configured to allow this.
    socketService.connect(); 
  };
  
  const logout = async () => {
    setUser(null); setToken(null);
    socketService.disconnect();
    await AsyncStorage.multiRemove(['userToken', 'userData']);
  };

  const contextValue = { user, token, isLoading, login, logout, register, startGuestSession };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);