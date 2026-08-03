import api from './axiosInstance';

const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // User Management
  getUsers: async (params) => {
    console.log("Admin Users Request Params:", params);
    const res = await api.get('/admin/users', { params });
    console.log("Admin Users Axios Response:", res);
    return res;
  },
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleUserStatus: (id, action) => api.patch(`/admin/users/${id}/status`, { action }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default adminService;
