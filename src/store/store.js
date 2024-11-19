// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import all reducers
import exerciseReducer from './exerciseSlice';
import specificBodyReducer from './specificBodySlice';
import specificExerciseReducer from './specificExerciseSlice';
import mediaReducer from './mediaSlice';
import caloriesReducer from './caloriesSlice';
import imageReducer from './imagesSlice';
import filteredImagesReducer from './filteredImagesSlice';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'exercise',
    'specificBody',
    'specificExercise',
    'media',
    'calories',
    'images',
    'filteredimages'
  ],
};

// Root Reducer Configuration
const rootReducer = combineReducers({
  exercise: exerciseReducer,
  specificBody: specificBodyReducer,
  specificExercise: specificExerciseReducer,
  media: mediaReducer,
  calories: caloriesReducer,
  images: imageReducer,
  filteredimages: filteredImagesReducer
});

// Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in development only
});

// Create Persistor
export const persistor = persistStore(store);

// Optional: Export a function to clear persisted state if needed
export const purgeStore = () => {
  persistor.purge();
};

export default store;