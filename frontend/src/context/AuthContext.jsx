import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { showToast } from '../components/ui/Toast';

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

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    const loadingToastId = showToast.loading('Signing in...');
    try {
      const response = await authService.login(credentials);
      
      // Store token securely in localStorage and update state
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      showToast.dismiss(loadingToastId);
      showToast.success('Logged in successfully!');
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      showToast.dismiss(loadingToastId);
      showToast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    const loadingToastId = showToast.loading('Creating account...');
    try {
      const response = await authService.register(userData);
      
      // Automatically log the user in after registration
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      
      showToast.dismiss(loadingToastId);
      showToast.success('Account created successfully!');
      return response;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      showToast.dismiss(loadingToastId);
      showToast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    // 1. Completely remove JWT token and any potential user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Clear authentication state in AuthContext
    setToken(null);
    setUser(null);
    setError(null);

    showToast.success('Logged out successfully');

    // 3. Force redirect to login page (ensures clean slate if Router Navigate doesn't catch it quickly enough)
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
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
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
