import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash"; // Make sure to install lodash

const useExerciseAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null); // Ref to store the abort controller

  // API function definition
  const api = useCallback((method, url, data = null) => {
    // Abort the previous request if it exists
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    return axios({
      method,
      url,
      data,
      signal: abortControllerRef.current.signal,
    }).catch((error) => {
      if (error.name === "CanceledError") {
        console.log("Request aborted");
        return; // Return to prevent further handling of this error
      }
      throw error; // Throw other errors to be handled in handleRequest
    });
  }, []);

  // Handle request with loading state
  const handleRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      await requestFn();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setError(message); // Simplified error handling
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced fetch appointments function
  const fetchAppointmentsDebounced = useMemo(() => 
    debounce(async () => {
      await handleRequest(async () => {
        const response = await api("get", "/api/auth/scheduling/create");
        setAppointments(response.data);
      });
    }, 300),
    [handleRequest, api] // use handleRequest and api as dependencies
  );

  const createAppointment = useCallback(
    async (exerciseName, appointmentDate) => {
      await handleRequest(async () => {
        const response = await api("post", "/api/auth/scheduling/create", {
          exerciseName,
          appointmentDate,
        });
        // Check if the response is valid before updating state
        if (response.data) {
          setAppointments((prev) => {
            // Prevent adding duplicates
            if (!prev.some((app) => app._id === response.data._id)) {
              return [...prev, response.data];
            }
            return prev;
          });
        }
      });
    },
    [api, handleRequest]
  );

  const updateAppointment = useCallback(
    async (id, exerciseName, appointmentDate) => {
      await handleRequest(async () => {
        const response = await api("put", `/api/auth/scheduling/update/${id}`, {
          exerciseName,
          appointmentDate,
        });
        // Update state only if the appointment was found
        if (response.data) {
          setAppointments((prev) =>
            prev.map((appointment) =>
              appointment._id === id ? response.data : appointment
            )
          );
        }
      });
    },
    [api, handleRequest]
  );

  const deleteAppointment = useCallback(
    async (id) => {
      await handleRequest(async () => {
        const response = await api(
          "delete",
          `/api/auth/scheduling/delete?${new URLSearchParams({ id })}`
        );

        if (response.status === 200) {
          setAppointments((prev) =>
            prev.filter((appointment) => appointment._id !== id)
          );
        } else {
          console.error("Failed to delete appointment:", response.data.message);
        }
      });
    },
    [api, handleRequest]
  );

  useEffect(() => {
    fetchAppointmentsDebounced(); // Call the debounced function on mount

    return () => {
      abortControllerRef.current?.abort(); // Clean up on unmount
      fetchAppointmentsDebounced.cancel(); // Cancel any pending debounced calls
    };
  }, [fetchAppointmentsDebounced]);

  return {
    appointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    loading,
    error,
  };
};

export default useExerciseAppointments;
