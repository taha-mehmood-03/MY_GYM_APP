// src/api/api.js
import axios from 'axios';

export const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': process.env.X_RapidAPI_Key, // Use your actual RapidAPI key
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error for handling in Redux
  }
};
