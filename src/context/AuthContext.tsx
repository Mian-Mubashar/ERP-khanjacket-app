/**
 * Khan Jacket House - Authentication Context
 * Provides global authentication state and login/logout methods
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, AuthUser, AuthResponse } from '../services/AuthService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, message: 'Not initialized' }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Listen to changes in AuthService
    const unsubscribe = AuthService.subscribe((updatedUser) => {
      setUser(updatedUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, pass: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(email, pass);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setUser(null);
    setIsLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

