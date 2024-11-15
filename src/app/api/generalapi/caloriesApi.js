import axios from 'axios';

const API_BASE_URL = 'https://nutrition-calculator.p.rapidapi.com/api/nutrition-info';
const API_KEY = '85c063e874msh9611e498f0ef111p143baejsn5f5482874015';  // Your API key

export const fetchCaloriesData = async (params) => {
  try {
    // Log the parameters to ensure they are correct
    console.log('Parameters:', {
      measurement_units: 'std',
      sex: "male",  // Should be either 'Male' or 'Female'
      age_value: String(params.age),
      age_type: 'yrs',
      feet: String(params.feet),
      inches: String(params.inches),
      lbs: String(params.weight),
      activity_level: 'Active'
    });

    const response = await axios.get(API_BASE_URL, {
      params: {
        measurement_units: 'std',
        sex: params.sex,  // Ensure this is either 'Male' or 'Female'
        age_value: String(params.age),
        age_type: 'yrs',
        feet: String(params.feet),
        inches: String(params.inches),
        lbs: String(params.weight),
        activity_level: 'Active'
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'nutrition-calculator.p.rapidapi.com',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching calories data:', error.response ? error.response.data : error.message);
    throw error;
  }
};
