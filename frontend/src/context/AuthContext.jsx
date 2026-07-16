import { useTranslation } from 'react-i18next';
import React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import profileService from '../services/profileService';
import { showToast } from '../components/ui/Toast';
import i18n from '../i18n/i18n';

// Create the context
export const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application to provide global auth state.
 */
export const AuthProvider = ({ children }) => {
  const { t } = useTranslation('common');

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    // 1. Completely remove JWT token and any potential user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Clear authentication state in AuthContext
    setToken(null);
    setUser(null);
    setError(null);

    showToast.success(t('loggedOutSuccessfu', 'Logged out successfully'));

    // 3. Force redirect to login page (ensures clean slate if Router Navigate doesn't catch it quickly enough)
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize the auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // If we have a token, fetch the user's latest full profile
          const response = await profileService.getProfile();
          if (response.success && response.user) {
            setUser(response.user);
            if (response.user.language) {
              i18n.changeLanguage(response.user.language);
            }
          } else {
            // Fallback for older authService if needed, but profileService is preferred
            setUser(response.user || response);
          }
        } catch (err) {
          console.error('Failed to authenticate stored token', err);
          // Token is likely invalid or expired, clean up state
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, logout]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    const loadingToastId = showToast.loading(t('signingIn', 'Signing in...'));
    try {
      const response = await authService.login(credentials);
      
      // Store token securely in localStorage and update state
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      if (response.user?.language) {
        i18n.changeLanguage(response.user.language);
      }
      
      showToast.dismiss(loadingToastId);
      showToast.success(t('loggedInSuccessful', 'Logged in successfully!'));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    const loadingToastId = showToast.loading(t('creatingAccount', 'Creating account...'));
    try {
      const response = await authService.register(userData);
      
      // Automatically log the user in after registration
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
      if (response.user?.language) {
        i18n.changeLanguage(response.user.language);
      }
      
      showToast.dismiss(loadingToastId);
      showToast.success(t('accountCreatedSucc', 'Account created successfully!'));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const response = await profileService.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      if (err.status === 401) {
        logout();
      }
    }
  }, [token, logout]);

  // Context value to be exposed globally, memoized to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  }), [user, token, loading, error, login, register, logout, updateUser, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
