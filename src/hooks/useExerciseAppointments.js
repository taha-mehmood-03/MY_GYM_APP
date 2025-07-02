// hooks/useExerciseAppointments.js
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";

const useExerciseAppointments = (userId = null) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const api = useCallback((method, url, data = null) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    return axios({
      method,
      url,
      data,
      signal: abortControllerRef.current.signal,
    }).catch((error) => {
      if (error.name === "CanceledError") return;
      throw error;
    });
  }, []);

  const handleRequest = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      await requestFn();
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointmentsDebounced = useMemo(() => 
    debounce(async () => {
      await handleRequest(async () => {
        const url = userId 
          ? `/api/auth/scheduling/list?userId=${encodeURIComponent(userId)}`
          : "/api/auth/scheduling/list";
        console.log('Fetching appointments from:', url);
        const response = await api("get", url);
        console.log('Fetched appointments:', response.data);
        setAppointments(response.data);
      });
    }, 300),
    [handleRequest, api, userId]
  );

  const createAppointment = useCallback(
    async (exerciseName, appointmentDate, userId = 'anonymous') => {
      console.log('Creating appointment:', { exerciseName, appointmentDate, userId });
      await handleRequest(async () => {
        const response = await api("post", "/api/auth/scheduling/create", {
          exercise: exerciseName,
          date: appointmentDate,
          userId,
        });
        console.log('Appointment created:', response.data);
        if (response.data) {
          setAppointments((prev) => 
            !prev.some(app => app._id === response.data._id) 
              ? [...prev, response.data] 
              : prev
          );
        }
      });
    },
    [api, handleRequest]
  );

  const deleteAppointment = useCallback(
    async (id) => {
      await handleRequest(async () => {
        await api("delete", `/api/auth/scheduling/delete?${new URLSearchParams({ id })}`);
        setAppointments(prev => prev.filter(app => app._id !== id));
      });
    },
    [api, handleRequest]
  );

  useEffect(() => {
    fetchAppointmentsDebounced();
    return () => {
      abortControllerRef.current?.abort();
      fetchAppointmentsDebounced.cancel();
    };
  }, [fetchAppointmentsDebounced]);

  return {
    appointments,
    createAppointment,
    deleteAppointment,
    loading,
    error,
  };
};

export default useExerciseAppointments;