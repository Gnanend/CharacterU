import axiosInstance from './axiosInstance';

/**
 * Service to handle all leaderboard-related API calls.
 */
const leaderboardService = {
  /**
   * Fetch the dynamic leaderboard rankings.
   * @param {Object} params - Optional query params like { page: 1, limit: 10, city: 'NY' }
   * @returns {Promise<Object>} API response containing the leaderboard data
   */
  getLeaderboard: async (params = {}) => {
    return await axiosInstance.get('/leaderboard', { params });
  },
};

export default leaderboardService;
