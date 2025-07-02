import axios from 'axios';
import { API_CONFIG, getNutritionHeaders } from '@/utils/api-config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sex, age, feet, inches, weight, activity_level = 'Active' } = req.query;

    // Validate required parameters
    if (!sex || !age || !feet || !inches || !weight) {
      return res.status(400).json({ 
        message: 'Missing required parameters: sex, age, feet, inches, weight' 
      });
    }

    console.log('Parameters:', {
      measurement_units: 'std',
      sex: sex,
      age_value: String(age),
      age_type: 'yrs',
      feet: String(feet),
      inches: String(inches),
      lbs: String(weight),
      activity_level: activity_level
    });

    const response = await axios.get(API_CONFIG.NUTRITION.BASE_URL, {
      params: {
        measurement_units: 'std',
        sex: sex,
        age_value: String(age),
        age_type: 'yrs',
        feet: String(feet),
        inches: String(inches),
        lbs: String(weight),
        activity_level: activity_level
      },
      headers: getNutritionHeaders(),
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching calories data:', error.response ? error.response.data : error.message);
    return res.status(500).json({ 
      message: 'Error fetching calories data', 
      error: error.response?.data || error.message 
    });
  }
} 