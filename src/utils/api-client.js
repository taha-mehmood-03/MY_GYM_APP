import axios from 'axios';
import { API_CONFIG, getExerciseDBHeaders, getNutritionHeaders } from './api-config';

const isServer = typeof window === 'undefined';

// Create axios instances for different APIs
const exerciseApi = axios.create({
  baseURL: API_CONFIG.EXERCISE_DB.BASE_URL,
  headers: getExerciseDBHeaders(),
  timeout: 10000,
});

const nutritionApi = axios.create({
  baseURL: API_CONFIG.NUTRITION.BASE_URL,
  headers: getNutritionHeaders(),
  timeout: 10000,
});

// Internal API client for Next.js API routes
const internalApi = axios.create({
  baseURL: isServer ? undefined : window.location.origin,
  timeout: 10000,
});

// Exercise API functions
export const exerciseApiClient = {
  // Get body part list
  getBodyPartList: async () => {
    const response = await exerciseApi.get(API_CONFIG.EXERCISE_DB.ENDPOINTS.BODY_PART_LIST);
    return response.data;
  },

  // Get exercises by body part
  getExercisesByBodyPart: async (bodyPart, limit = 1000, offset = 0) => {
    console.log('🌐 API Call - getExercisesByBodyPart');
    console.log('📝 Body Part parameter:', bodyPart);
    console.log('📊 Limit parameter:', limit);
    console.log('📊 Offset parameter:', offset);
    console.log('🔗 URL being called:', `${API_CONFIG.EXERCISE_DB.ENDPOINTS.BODY_PART}/${encodeURIComponent(bodyPart)}?limit=${limit}&offset=${offset}`);
    
    try {
      // Use the body part specific endpoint to filter exercises
      const response = await exerciseApi.get(
        `${API_CONFIG.EXERCISE_DB.ENDPOINTS.BODY_PART}/${encodeURIComponent(bodyPart)}?limit=${limit}&offset=${offset}`
      );
      
      console.log('✅ API Response Success:', response.data);
      console.log('📊 Response length:', response.data?.length || 0);
      console.log('📋 First few exercises:', response.data?.slice(0, 3));
      
      return response.data;
    } catch (error) {
      console.error('❌ API Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Get specific exercise
  getExercise: async (id) => {
    const response = await exerciseApi.get(`/exercises/exercise/${id}`);
    return response.data;
  },

  // Get exercises by name
  getExercisesByName: async (name, limit = 1000) => {
    console.log('🌐 API Call - getExercisesByName');
    console.log('📝 Name parameter:', name);
    console.log('📊 Limit parameter:', limit);
    console.log('🔗 URL being called:', `/exercises/name/${encodeURIComponent(name)}?limit=${limit}`);
    
    const response = await exerciseApi.get(`/exercises/name/${encodeURIComponent(name)}?limit=${limit}`);
    
    console.log('📦 API Response:', response.data);
    console.log('📊 Response length:', response.data?.length || 0);
    
    return response.data;
  },
};

// Nutrition API functions
export const nutritionApiClient = {
  // Calculate calories
  calculateCalories: async (params) => {
    const response = await nutritionApi.get('', { params });
    return response.data;
  },
};

// Internal API functions
export const internalApiClient = {
  // Get images
  getImages: async () => {
    const response = await internalApi.get('/api/images/get');
    return response.data;
  },

  // Store images
  storeImages: async (images) => {
    const response = await internalApi.post('/api/auth/storingImages', images);
    return response.data;
  },

  // Upload image
  uploadImage: async (formData) => {
    const response = await internalApi.post('/api/auth/uploadImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Error handling middleware
exerciseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Exercise API Error:', error);
    return Promise.reject(error);
  }
);

nutritionApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Nutrition API Error:', error);
    return Promise.reject(error);
  }
);

internalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Internal API Error:', error);
    return Promise.reject(error);
  }
);

// Utility function to normalize body part names for API usage
export const normalizeBodyPartName = (bodyPart) => {
  if (!bodyPart) return "";
  const mapping = {
    'back': 'back',
    'cardio': 'cardio',
    'chest': 'chest',
    'lower arms': 'lower arms',
    'lower legs': 'lower legs',
    'neck': 'neck',
    'shoulders': 'shoulders',
    'upper arms': 'upper arms',
    'upper legs': 'upper legs',
    'waist': 'waist',
  };
  // Try mapping first, fallback to lowercased, trimmed string
  return mapping[bodyPart.trim().toLowerCase()] || bodyPart.trim().toLowerCase();
};

// At the end of the file, before export default
const apiClients = {
  exerciseApi,
  nutritionApi,
  internalApi,
};

export default apiClients; 