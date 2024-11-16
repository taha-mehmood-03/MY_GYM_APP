import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExercises } from '@/STORE/exerciseSlice';
import debounce from 'lodash.debounce';

const useFetchExercises = (endpoint, slice, initialData = []) => {
  const dispatch = useDispatch();
  const debouncedFetchData = useRef(debounce((endpoint, slice) => {
    dispatch(fetchExercises({ endpoint, slice }));
  }, 500)).current;

  const selectExercises = useCallback((state) => {
    if (slice === 'exercise') {
      return state.exercise.exercises;
    }
    if (slice === 'specificBody') {
      return state.specificBody.specificExercises; // Change to specificBody state
    }
    return [];
  }, [slice]);

  const data = useSelector(selectExercises);
  const status = useSelector((state) => state.exercise.status);
  const error = useSelector((state) => state.exercise.error);

  // Trigger fetch on initial mount or when the endpoint changes
  useEffect(() => {
    debouncedFetchData(endpoint, slice);
    return debouncedFetchData.cancel; // Cancel on unmount
  }, [endpoint, slice, debouncedFetchData]);

  return { data: data.length ? data : initialData, status, error };
};

export default useFetchExercises;
