// src/api/api.js
import axios from 'axios';

export const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': 'c283f37b6fmsh91e221f7a507e9ep18f65cjsn4394cb61d380', // Use your actual RapidAPI key
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error for handling in Redux
  }
};
