// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage
import { combineReducers } from 'redux';

// Import all slices
import exerciseReducer from '@/exerciseSlice';
import specificBodyReducer from '@/specificBodySlice';
import specificExerciseReducer from '@/specificExerciseSlice';
import mediaReducer from '@/mediaSlice';
import caloriesReducer from '@/caloriesSlice';
import imageReducer from '@/imagesSlice';
import filteredImagesReducer from '@/filteredImagesSlice';

// Configuration for persisting state in local storage
const persistConfig = {
  key: 'root',
  storage, // Correctly using the storage from redux-persist
  whitelist: [
    'exercise', 
    'specificBody', 
    'specificExercise', 
    'media', 
    'calories', 
    'images', 
    'filteredimages' // Make sure this matches the slice name exactly
  ],
};

// Combine all the reducers into one root reducer
const rootReducer = combineReducers({
  exercise: exerciseReducer,
  specificBody: specificBodyReducer,
  specificExercise: specificExerciseReducer,
  media: mediaReducer,
  calories: caloriesReducer,
  images: imageReducer,
  filteredimages: filteredImagesReducer, // Ensure this key matches the whitelist
});

// Create a persisted reducer with configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with middleware settings to handle non-serializable actions
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create a persistor to save the store state
export const persistor = persistStore(store);
