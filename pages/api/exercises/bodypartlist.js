import axios from 'axios';
import { API_CONFIG, getExerciseDBHeaders } from '@/utils/api-config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.get(
      `${API_CONFIG.EXERCISE_DB.BASE_URL}${API_CONFIG.EXERCISE_DB.ENDPOINTS.BODY_PART_LIST}`,
      {
        headers: getExerciseDBHeaders(),
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching body part list:', error);
    return res.status(500).json({ 
      message: 'Error fetching body part list', 
      error: error.response?.data || error.message 
    });
  }
} 