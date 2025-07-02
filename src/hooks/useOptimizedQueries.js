import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/STORE/zustand-store';
import { exerciseApiClient, nutritionApiClient, internalApiClient } from '@/utils/api-client';
import React from 'react';

// Query keys for better cache management
export const QUERY_KEYS = {
  IMAGES: 'images',
  EXERCISES: 'exercises',
  BODY_PARTS: 'bodyParts',
  SPECIFIC_EXERCISES: 'specificExercises',
  CALORIES: 'calories',
};

// Optimized images hook
export const useImages = (initialData = []) => {
  const { images, setImages, setLoading, setError } = useAppStore();

  console.log('[useImages] initialData:', initialData);
  console.log('[useImages] Zustand images:', images);

  return useQuery({
    queryKey: [QUERY_KEYS.IMAGES],
    queryFn: internalApiClient.getImages,
    initialData: images.length > 0 ? images : initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onSuccess: (data) => {
      console.log('[useImages] onSuccess - data:', data);
      setImages(data);
      setLoading('images', false);
      setError('images', null);
    },
    onError: (error) => {
      console.error('[useImages] onError - error:', error);
      setError('images', error.message);
      setLoading('images', false);
    },
    onSettled: () => {
      console.log('[useImages] onSettled');
      setLoading('images', false);
    },
  });
};

// Optimized exercises hook
export const useExercises = (initialData = []) => {
  const { exercises, setExercises, setLoading, setError } = useAppStore();

  console.log('[useExercises] initialData:', initialData);
  console.log('[useExercises] Zustand exercises:', exercises);

  return useQuery({
    queryKey: [QUERY_KEYS.EXERCISES],
    queryFn: exerciseApiClient.getBodyPartList,
    initialData: exercises.length > 0 ? exercises : initialData,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    onSuccess: (data) => {
      console.log('[useExercises] onSuccess - data:', data);
      setExercises(data);
      setLoading('exercises', false);
      setError('exercises', null);
    },
    onError: (error) => {
      console.error('[useExercises] onError - error:', error);
      setError('exercises', error.message);
      setLoading('exercises', false);
    },
    onSettled: () => {
      console.log('[useExercises] onSettled');
      setLoading('exercises', false);
    },
  });
};

// Optimized specific exercises hook
export const useSpecificExercises = (bodyPart, enabled = false) => {
  const { specificExercises, setSpecificExercises, setLoading, setError } = useAppStore();

  console.log('=== useSpecificExercises Debug ===');
  console.log('Body Part:', bodyPart);
  console.log('Enabled:', enabled);
  console.log('Current specificExercises in store:', specificExercises);

  const query = useQuery({
    queryKey: [QUERY_KEYS.SPECIFIC_EXERCISES, bodyPart],
    queryFn: async () => {
      console.log('🔍 Starting API call for body part:', bodyPart);
      console.log('🔍 API function: getExercisesByBodyPart');
      
      // Use getExercisesByBodyPart with maximum limit (1000) to get all exercises
      const data = await exerciseApiClient.getExercisesByBodyPart(bodyPart, 1000, 0);
      
      console.log('🔍 Raw API response received:', data);
      console.log('🔍 Response type:', typeof data);
      console.log('🔍 Is array:', Array.isArray(data));
      console.log('🔍 Response length:', data?.length || 0);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('🔍 First exercise example:', data[0]);
        console.log('🔍 Exercise structure:', Object.keys(data[0] || {}));
      }
      
      return data;
    },
    enabled: enabled && !!bodyPart,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    onSuccess: (data) => {
      console.log('✅ Successfully fetched exercises for', bodyPart, ':', data);
      console.log('📊 Number of exercises:', data?.length || 0);
      console.log('💾 About to store data in Zustand store...');
      setSpecificExercises(data);
      console.log('💾 Data stored in Zustand store');
      setLoading('specificExercises', false);
      setError('specificExercises', null);
      console.log('✅ onSuccess callback completed');
    },
    onError: (error) => {
      console.error('❌ Error fetching specific exercises for body part:', bodyPart, error);
      setError('specificExercises', error.message);
      setLoading('specificExercises', false);
    },
    onSettled: () => {
      console.log('🏁 onSettled callback called');
      setLoading('specificExercises', false);
    },
  });

  // Also update store when data changes
  React.useEffect(() => {
    if (query.data && query.data.length > 0) {
      console.log('🔄 useEffect - Updating store with query data:', query.data);
      console.log('🔄 useEffect - Data length:', query.data.length);
      console.log('🔄 useEffect - First exercise:', query.data[0]);
      setSpecificExercises(query.data);
      console.log('🔄 useEffect - Store updated successfully');
    } else if (query.data && query.data.length === 0) {
      console.log('🔄 useEffect - No exercises found for body part:', bodyPart);
      setSpecificExercises([]);
    }
  }, [query.data, setSpecificExercises, bodyPart]);

  return query;
};

// Optimized calories hook
export const useCalories = () => {
  const { caloriesData, setCaloriesData, setLoading, setError } = useAppStore();

  return useQuery({
    queryKey: [QUERY_KEYS.CALORIES],
    queryFn: () => Promise.resolve(caloriesData), // Use cached data
    enabled: false, // Don't auto-fetch
    staleTime: Infinity, // Never stale
    cacheTime: Infinity, // Keep forever
    onSuccess: (data) => {
      setCaloriesData(data);
      setLoading('calories', false);
      setError('calories', null);
    },
    onError: (error) => {
      setError('calories', error.message);
      setLoading('calories', false);
    },
  });
};

// Calories calculation mutation
export const useCalculateCalories = () => {
  const { setCaloriesData, setLoading, setError } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: nutritionApiClient.calculateCalories,
    onMutate: () => {
      setLoading('calories', true);
      setError('calories', null);
    },
    onSuccess: (data) => {
      setCaloriesData(data);
      setLoading('calories', false);
      queryClient.setQueryData([QUERY_KEYS.CALORIES], data);
    },
    onError: (error) => {
      setError('calories', error.message);
      setLoading('calories', false);
    },
  });
};

// Image upload mutation
export const useUploadImage = () => {
  const { setImages } = useAppStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internalApiClient.uploadImage,
    onSuccess: (data) => {
      // Update images cache
      queryClient.setQueryData([QUERY_KEYS.IMAGES], (oldData) => {
        return oldData ? [...oldData, data] : [data];
      });
      // Update Zustand store
      setImages([...(queryClient.getQueryData([QUERY_KEYS.IMAGES]) || []), data]);
    },
  });
};

// Store images mutation
export const useStoreImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: internalApiClient.storeImages,
    onSuccess: () => {
      // Invalidate images cache to refetch
      queryClient.invalidateQueries([QUERY_KEYS.IMAGES]);
    },
  });
}; 