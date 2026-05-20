import axiosInstance from './axiosInstance';

/**
 * Service to handle Daily Check-In API communication.
 */
const checkInService = {
  /**
   * Submit a new daily check-in
   * @param {Object} checkInData - { activities, notes }
   * @returns {Promise<Object>} API response
   */
  submitCheckIn: async (checkInData) => {
    return await axiosInstance.post('/checkins', checkInData);
  },

  /**
   * Retrieve the authenticated user's check-in history
   * @returns {Promise<Object>} API response
   */
  getMyCheckIns: async () => {
    return await axiosInstance.get('/checkins/me');
  }
};

export default checkInService;
