// STORE/zustand-store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      images: [],
      setImages: (images) => set({ images }),
      clearImages: () => set({ images: [] }),

      exercises: [],
      setExercises: (exercises) => set({ exercises }),
      clearExercises: () => set({ exercises: [] }),

      specificExercises: [],
      setSpecificExercises: (exercises) => set({ specificExercises: exercises }),
      clearSpecificExercises: () => set({ specificExercises: [] }),

      selectedBodyPart: null,
      setSelectedBodyPart: (bodyPart) => set({ selectedBodyPart: bodyPart }),
      clearSelectedBodyPart: () => set({ selectedBodyPart: null }),

      filteredImages: [],
      setFilteredImages: (images) => set({ filteredImages: images }),
      clearFilteredImages: () => set({ filteredImages: [] }),

      caloriesData: null,
      setCaloriesData: (data) => set({ caloriesData: data }),
      clearCaloriesData: () => set({ caloriesData: null }),

      specificExercise: null,
      setSpecificExercise: (exercise) => set({ specificExercise: exercise }),
      clearSpecificExercise: () => set({ specificExercise: null }),

      src: null,
      setSrc: (src) => set({ src }),

      loading: {
        images: false,
        exercises: false,
        specificExercises: false,
        calories: false,
      },
      setLoading: (key, value) => 
        set((state) => ({
          loading: { ...state.loading, [key]: value }
        })),

      errors: {
        images: null,
        exercises: null,
        specificExercises: null,
        calories: null,
      },
      setError: (key, error) => 
        set((state) => ({
          errors: { ...state.errors, [key]: error }
        })),
      clearError: (key) => 
        set((state) => ({
          errors: { ...state.errors, [key]: null }
        })),

      reset: () => set({
        images: [],
        exercises: [],
        specificExercises: [],
        filteredImages: [],
        caloriesData: null,
        specificExercise: null,
        src: null,
        loading: {
          images: false,
          exercises: false,
          specificExercises: false,
          calories: false,
        },
        errors: {
          images: null,
          exercises: null,
          specificExercises: null,
          calories: null,
        },
      }),
    }),
    {
      name: 'gym-app-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        images: state.images,
        exercises: state.exercises,
        specificExercises: state.specificExercises,
        caloriesData: state.caloriesData,
        specificExercise: state.specificExercise,
        src: state.src,
      }),
    }
  )
);