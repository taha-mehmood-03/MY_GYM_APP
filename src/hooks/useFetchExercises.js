import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExercises } from "@/STORE/exerciseSlice";
import debounce from "lodash.debounce";

const useFetchExercises = (endpoint, slice, initialData = []) => {
  const dispatch = useDispatch();

  // Use ref to store the debounced function and prevent recreation
  const debouncedFetchData = useRef(
    debounce((currentEndpoint, currentSlice) => {
      dispatch(fetchExercises({ endpoint: currentEndpoint, slice: currentSlice }));
    }, 500)
  ).current;

  // Selector logic to dynamically choose the correct slice data
  const selectExercises = useCallback(
    (state) => {
      switch (slice) {
        case "exercise":
          return state.exercise.exercises;
        case "specificBody":
          return state.specificBody.specificExercises;
        default:
          return [];
      }
    },
    [slice]
  );

  const data = useSelector(selectExercises);
  const status = useSelector((state) => state[slice]?.status || "idle");
  const error = useSelector((state) => state[slice]?.error || null);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (endpoint && slice) {
      debouncedFetchData(endpoint, slice);
    }

    // Cleanup debounced calls on unmount
    return () => {
      debouncedFetchData.cancel();
    };
  }, [endpoint, slice, debouncedFetchData]);

  return { data: data.length ? data : initialData, status, error };
};

export default useFetchExercises;
