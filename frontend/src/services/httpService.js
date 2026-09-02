import axios from 'axios';
import CryptoJS from 'crypto-js';

// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-secret-key';

// 1. Create Axios Instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper: Encrypt API Key
const getEncryptedApiKey = () => {
  const rawApiKey = import.meta.env.VITE_RAW_API_KEY || 'my-microservice-api-key';
  return CryptoJS.AES.encrypt(rawApiKey, SECRET_KEY).toString();
};

// 2. Request Interceptor (Injects encrypted X-API-Key into every request)
axiosInstance.interceptors.request.use(
  (config) => {
    const encryptedKey = getEncryptedApiKey();
    config.headers['X-API-Key'] = encryptedKey;
    
    // Optional: Attach Bearer tokens here if needed in the future
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Unwraps response data or formats global errors)
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global microservice errors (e.g., 401, 403)
    if (error.response?.status === 403) {
      console.error('Invalid or missing X-API-Key authentication');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// 4. Clean Wrapper Interface
const httpService = {
  get: (url, params = {}) => axiosInstance.get(url, { params }),
  post: (url, data = {}) => axiosInstance.post(url, data),
  put: (url, data = {}) => axiosInstance.put(url, data),
  patch: (url, data = {}) => axiosInstance.patch(url, data),
  delete: (url) => axiosInstance.delete(url),
};

export default httpService;