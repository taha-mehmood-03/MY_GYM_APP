import axios from 'axios';
import https from 'https';

// Create a custom axios instance with proper configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure https agent for development
if (process.env.NODE_ENV === 'development') {
  axiosInstance.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });
}

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    // You can add custom error handling here
    return Promise.reject(error);
  }
);

export default axiosInstance;