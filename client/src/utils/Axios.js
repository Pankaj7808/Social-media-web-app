// src/axiosConfig.js
import axios from 'axios';

// Set up the default base URL for Axios
axios.defaults.baseURL = 'http://localhost:5000'; // Set your base URL

// Optional: Add interceptors if you need to manage requests (e.g., adding tokens)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
