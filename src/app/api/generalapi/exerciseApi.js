// src/api/api.js
import axios from 'axios';

export const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': 'c8ebee3918msh76b6f3fcec77a0cp1389f0jsnad7f7298eb82', // Use your actual RapidAPI key
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error for handling in Redux
  }
};
