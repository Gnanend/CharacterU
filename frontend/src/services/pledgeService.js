import axiosInstance from './axiosInstance';

/**
 * Service to handle all pledge-related API calls.
 */
const pledgeService = {
  /**
   * Upload a video file to Cloudinary via the backend.
   * @param {File} videoFile - The video file object from the input
   * @param {Function} onUploadProgress - Optional callback for upload progress
   * @returns {Promise<Object>} API response payload containing the videoUrl
   */
  uploadVideo: async (videoFile, onUploadProgress) => {
    const formData = new FormData();
    formData.append('video', videoFile);

    // We override the default application/json Content-Type for this specific request
    return await axiosInstance.post('/pledges/upload-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  /**
   * Submit the final pledge data
   * @param {Object} pledgeData - { pledgeText, language, videoUrl }
   * @returns {Promise<Object>} API response payload
   */
  submitPledge: async (pledgeData) => {
    return await axiosInstance.post('/pledges', pledgeData);
  },
};

export default pledgeService;
