import axiosInstance from './axiosInstance';

const certificateService = {
  getStatus: async () => {
    return await axiosInstance.get('/certificates/status');
  },
  generate: async () => {
    return await axiosInstance.post('/certificates/generate');
  },
  verify: async (certificateId) => {
    return await axiosInstance.get(`/public/verify/${certificateId}`);
  },
  getAdminAnalytics: async () => {
    return await axiosInstance.get(`/admin/analytics/verification`);
  }
};

export default certificateService;
