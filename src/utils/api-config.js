// API Configuration - Centralized configuration for all external APIs
export const API_CONFIG = {
  // ExerciseDB API Configuration
  EXERCISE_DB: {
    BASE_URL: 'https://exercisedb.p.rapidapi.com',
    API_KEY: 'cdf9426761mshd204ec6869f770dp1bcf43jsn7dd79f798255',
    HOST: 'exercisedb.p.rapidapi.com',
    ENDPOINTS: {
      BODY_PART_LIST: '/exercises/bodyPartList',
      BODY_PART: '/exercises/bodyPart',
      EXERCISES: '/exercises',
    }
  },
  
  // Nutrition Calculator API Configuration
  NUTRITION: {
    BASE_URL: 'https://nutrition-calculator.p.rapidapi.com/api/nutrition-info',
    API_KEY: '85c063e874msh9611e498f0ef111p143baejsn5f5482874015',
    HOST: 'nutrition-calculator.p.rapidapi.com'
  }
};

// Helper function to get ExerciseDB headers
export const getExerciseDBHeaders = () => ({
  'x-rapidapi-key': API_CONFIG.EXERCISE_DB.API_KEY,
  'x-rapidapi-host': API_CONFIG.EXERCISE_DB.HOST,
});

// Helper function to get Nutrition API headers
export const getNutritionHeaders = () => ({
  'x-rapidapi-key': API_CONFIG.NUTRITION.API_KEY,
  'x-rapidapi-host': API_CONFIG.NUTRITION.HOST,
}); 