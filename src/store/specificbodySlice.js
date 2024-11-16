import { createSlice } from '@reduxjs/toolkit';
import { fetchExercises } from '@/STORE/exerciseSlice'; // Assuming this action fetches exercises

const specificBodySlice = createSlice({
  name: 'specificBody',
  initialState: {
    specificExercises: [],  // All exercises for a specific body part
    filteredExercises: [],  // Exercises filtered by the search term
    images: [],  // Images associated with the exercises
    status: 'idle',  // The current loading status ('idle', 'loading', 'succeeded', 'failed')
    error: null,  // Any error that occurred during the fetch
  },
  reducers: {
    setExercises(state, action) {
      // Directly set exercises from the action payload
      state.specificExercises = action.payload;
      state.filteredExercises = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    resetImages: (state) => {
      state.images = [];
    },
    searchExercises: (state, action) => {
      state.filteredExercises = action.payload;
    },
    clearSearch: (state) => {
      state.filteredExercises = []; 
      // Reset filtered exercises
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the loading state for fetching exercises
      .addCase(fetchExercises.pending, (state) => {
        state.status = 'loading'; // Set loading status
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        if (action.payload.slice === 'specificBody') {
          state.specificExercises = action.payload.data;
          state.filteredExercises = action.payload.data; // Set filtered exercises to the fetched data
        }
        state.status = 'succeeded'; // Set status to succeeded once fetching is complete
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed if there is an error
        state.error = action.error.message; // Capture the error message
      });
  },
});

export const { setImages, resetImages, searchExercises, clearSearch, setExercises } = specificBodySlice.actions;

export default specificBodySlice.reducer;
