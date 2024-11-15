// src/store/specificExerciseSlice.js

import { createSlice } from '@reduxjs/toolkit';

const specificExerciseSlice = createSlice({
  name: 'specificExercise',
  initialState: {
    specificExercise: null,
  },
  reducers: {
    setSpecificExercise: (state, action) => {
      state.specificExercise = action.payload;
    },
  },
});

export const { setSpecificExercise } = specificExerciseSlice.actions;
export default specificExerciseSlice.reducer;
