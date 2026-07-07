import axiosInstance from './axiosInstance';

/**
 * Service to handle all leaderboard-related API calls.
 */
const leaderboardService = {
  getGlobalLeaderboard: async (params = {}, options = {}) => {
    return await axiosInstance.get('/leaderboard/global', { params, ...options });
  },
  getCountryLeaderboard: async (params = {}, options = {}) => {
    return await axiosInstance.get('/leaderboard/country', { params, ...options });
  },
  getCityLeaderboard: async (params = {}, options = {}) => {
    return await axiosInstance.get('/leaderboard/city', { params, ...options });
  },
};

export default leaderboardService;
