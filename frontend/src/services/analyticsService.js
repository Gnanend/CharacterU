import axiosInstance from './axiosInstance';

/**
 * Service to handle all analytics-related API calls.
 */
const analyticsService = {
  /**
   * Fetch the comprehensive dashboard analytics payload.
   * @returns {Promise<Object>} API response containing the dashboard data
   */
  getDashboardAnalytics: async () => {
    return await axiosInstance.get('/analytics/dashboard');
  },
};

export default analyticsService;
