import React, { createContext, useState, useEffect, useContext } from 'react';
import authApi from '../services/api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication state on refresh/mount
  const verifyAuth = async () => {
    try {
      const res = await authApi.getCurrentUser();
      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
      }
      return res;
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
      }
      return res;
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser: verifyAuth
      }}
    >
      <React.Fragment key={currentUser?._id || 'signed-out'}>{children}</React.Fragment>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
