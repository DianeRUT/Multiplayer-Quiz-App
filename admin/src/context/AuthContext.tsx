import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on app load
    const checkAuth = () => {
      console.log('AuthContext: Checking for existing auth data...');
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      console.log('AuthContext: Stored token exists:', !!storedToken);
      console.log('AuthContext: Stored user exists:', !!storedUser);
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext: Parsed user data:', userData);
          // Only restore admin users
          if (userData.role === 'ADMIN') {
            console.log('AuthContext: User is admin, restoring auth state...');
            setToken(storedToken);
            setUser(userData);
          } else {
            console.log('AuthContext: User is not admin, clearing auth data...');
            // Clear non-admin data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('AuthContext: Error parsing stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } else {
        console.log('AuthContext: No stored auth data found');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('AuthContext: State changed - user:', !!user, 'token:', !!token, 'isLoading:', isLoading);
  }, [user, token, isLoading]);

  const login = async (email: string, password: string): Promise<void> => {
    console.log('AuthContext: login function called with email:', email);
    
    try {
      console.log('AuthContext: Calling authAPI.login...');
      const response = await authAPI.login({ email, password });
      console.log('AuthContext: Login response received:', response);
      
      // Only allow admin users
      if (response.user.role !== 'ADMIN') {
        console.log('AuthContext: User is not admin, role:', response.user.role);
        throw new Error('Access denied. This dashboard is for administrators only. Please use the mobile app.');
      }
      
      console.log('AuthContext: User is admin, setting auth state...');
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('AuthContext: Login successful, auth state updated');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('AuthContext: User updated:', updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: (() => {
      const authenticated = !!token && !!user;
      console.log('AuthContext: isAuthenticated computed - token:', !!token, 'user:', !!user, 'result:', authenticated);
      return authenticated;
    })(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export as default for better compatibility
export default useAuth; 