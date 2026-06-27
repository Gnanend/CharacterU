import axiosInstance from './axiosInstance';

const profileService = {
  getProfile: async () => {
    const response = await axiosInstance.get('/profile/me');
    return response;
  },
  
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/profile/me', profileData);
    return response;
  }
};

export default profileService;
