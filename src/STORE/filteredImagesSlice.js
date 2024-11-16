// src/store/filteredImagesSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [], // Initialize the images array
};

const filteredImagesSlice = createSlice({
  name: 'filteredimages',
  initialState,
  reducers: {
    setFilteredImages: (state, action) => {
      state.images = action.payload; // Store the filtered images in the state
    },
  },
});

// Export the action to set filtered images
export const { setFilteredImages } = filteredImagesSlice.actions;

// Export the reducer to be included in the store
export default filteredImagesSlice.reducer;
