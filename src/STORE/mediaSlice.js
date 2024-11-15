import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  src: '',         // Default empty string for image source
   // Default null for start time
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSrc(state, action) {
      state.src = action.payload;
    },
  
  },
});

export const { setSrc } = mediaSlice.actions;

export default mediaSlice.reducer;
