import React, { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, validate token with backend
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, make API call to login
      // For demo, we'll simulate a successful login
      const mockUser = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
      };

      // Store auth data
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
    } catch (error) {
      setError('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // In a real app, make API call to logout
      
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      setUser(null);
    } catch (error) {
      setError('Logout failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      login,
      logout,
      isLoading,
      error
    },
    children
  });
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 