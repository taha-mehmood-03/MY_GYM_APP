// store/imageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [], // Initial state as an array of objects
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload; // Set the images from payload
    },
    clearImages: (state) => {
      state.images = []; // Clear images
    },
  },
});

export const { setImages, clearImages } = imageSlice.actions;


export default imageSlice.reducer;
