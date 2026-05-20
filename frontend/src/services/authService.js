import axiosInstance from './axiosInstance';

/**
 * Service to handle all authentication related API calls.
 * Base URL and token injection are handled automatically by axiosInstance.
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { fullName, email, password, role }
   * @returns {Promise<Object>} API response payload containing token and user
   */
  register: async (userData) => {
    return await axiosInstance.post('/auth/register', userData);
  },

  /**
   * Login an existing user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} API response payload containing token and user
   */
  login: async (credentials) => {
    return await axiosInstance.post('/auth/login', credentials);
  },

  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>} API response payload containing user profile
   */
  getMe: async () => {
    return await axiosInstance.get('/auth/me');
  },
};

export default authService;
