import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Create the context
export const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application to provide global auth state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // If we have a token, fetch the user's latest profile
          const response = await authService.getMe();
          setUser(response.user);
        } catch (err) {
          console.error('Failed to authenticate stored token', err);
          // Token is likely invalid or expired, clean up state
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  /**
   * Handle user login
   * @param {Object} credentials - email and password
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      
      // Store token securely in localStorage and update state
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user registration
   * @param {Object} userData - fullName, email, password, role
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      
      // Automatically log the user in after registration
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  // Context value to be exposed globally
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
