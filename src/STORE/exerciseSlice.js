import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Exercises Thunk
export const fetchExercises = createAsyncThunk(
  'exercise/fetchExercises',
  async ({ endpoint, slice }, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          "X-RapidAPI-Key":"c8ebee3918msh76b6f3fcec77a0cp1389f0jsnad7f7298eb82",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      });
      return { data: response.data, slice }; // Returning slice to identify where to store data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Exercise Slice
const exerciseSlice = createSlice({
  name: 'exercise',
  initialState: {
    exercises: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        if (action.payload.slice === 'exercise') {
        console.log("Fulfilled action payload:", action.payload); // Log the payload
        state.status = 'succeeded';
        state.exercises = action.payload.data;}
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Exporting the action creators
export const { setExercises} = exerciseSlice.actions;

export default exerciseSlice.reducer;