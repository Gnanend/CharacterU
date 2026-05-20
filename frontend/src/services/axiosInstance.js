import axios from 'axios';

// Create a centralized Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach headers or logs
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling and data unpacking
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the data directly to simplify calls
    return response.data;
  },
  (error) => {
    let customError = {
      message: 'An unexpected error occurred. Please try again later.',
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response) {
      // Server responded with a status other than 2xx
      customError.message = error.response.data?.message || customError.message;
    } else if (error.request) {
      // Request was made but no response received
      customError.message = 'No response received from the server. Please check your internet connection.';
    } else {
      // Error setting up the request
      customError.message = error.message;
    }

    console.error('[API Error]:', customError);
    return Promise.reject(customError);
  }
);

export default axiosInstance;
