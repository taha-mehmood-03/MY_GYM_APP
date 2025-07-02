import axios from 'axios';
import { API_CONFIG, getExerciseDBHeaders } from '@/utils/api-config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { bodyPart, limit = 1000, offset = 0 } = req.query;
    
    if (!bodyPart) {
      return res.status(400).json({ message: 'bodyPart parameter is required' });
    }

    const apiEndpoint = `${API_CONFIG.EXERCISE_DB.BASE_URL}${API_CONFIG.EXERCISE_DB.ENDPOINTS.BODY_PART}/${bodyPart}?limit=${limit}&offset=${offset}`;
    console.log('Calling exercise API:', apiEndpoint);
    const response = await axios.get(apiEndpoint, {
      headers: getExerciseDBHeaders(),
    });
    console.log('Number of exercises returned:', response.data.length);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching body part exercises:', error);
    return res.status(500).json({ 
      message: 'Error fetching body part exercises', 
      error: error.response?.data || error.message 
    });
  }
} 