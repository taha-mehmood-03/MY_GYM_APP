// services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => {
    // Log the request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default apiClient;