import axiosInstance from './axiosInstance';

const certificateService = {
  getStatus: async () => {
    return await axiosInstance.get('/certificates/status');
  },
  generate: async () => {
    return await axiosInstance.post('/certificates/generate');
  },
  verify: async (token) => {
    return await axiosInstance.get(`/certificates/verify/${token}`);
  }
};

export default certificateService;
