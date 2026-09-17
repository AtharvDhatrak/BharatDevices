import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY ;
const RAW_API_KEY = import.meta.env.VITE_RAW_API_KEY ;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Default for normal JSON requests
  },
  timeout: 10000,
});

const getEncryptedApiKey = () => {
  try {
    return CryptoJS.AES.encrypt(RAW_API_KEY, SECRET_KEY).toString();
  } catch (error) {
    return RAW_API_KEY;
  }
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Attach API Key
    config.headers['X-Api-Key'] = getEncryptedApiKey();

    // 2. Attach JWT Bearer Token
    const token = localStorage.getItem('token') || localStorage.getItem('jwtToken') || localStorage.getItem('authToken');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. CRITICAL FIX FOR FILE UPLOADS:
    // If the data being sent is FormData, delete the default application/json 
    // so the browser can inject multipart/form-data with the correct boundary string.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  get: (url, params = {}) => axiosInstance.get(url, { params }),
  // The post method already accepts data and passes it straight to axiosInstance.post
  post: (url, data = {}) => axiosInstance.post(url, data),
  put: (url, data = {}) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),
};