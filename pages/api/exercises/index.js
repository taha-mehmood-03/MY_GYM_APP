import axios from 'axios';
import { getExerciseDBHeaders } from '@/utils/api-config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ message: 'URL parameter is required' });
    }

    const response = await axios.get(url, {
      headers: getExerciseDBHeaders(),
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching exercise data:', error);
    return res.status(500).json({ 
      message: 'Error fetching data', 
      error: error.response?.data || error.message 
    });
  }
} 