// src/store/caloriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCaloriesData } from '@/app/api/generalapi/caloriesApi';  // Adjust the path accordingly
import { createSelector } from '@reduxjs/toolkit';
// Async thunk to fetch calories data
export const fetchCalories = createAsyncThunk('calories/fetchCalories', async (params, { rejectWithValue }) => {
  try {
    const response = await fetchCaloriesData(params);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const caloriesSlice = createSlice({
  name: 'calories',
  initialState: {
    caloriesData: null,  // Will store the fetched data
    status: 'idle',      // Tracks loading state
    error: null,         // Stores error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCalories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.caloriesData = action.payload;  // Store the fetched calories data
      })
      .addCase(fetchCalories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;  // Store the error message
      });
  },
});
export const selectCaloriesData = (state) => state.calories.caloriesData;
// Export the reducer
export default caloriesSlice.reducer;
