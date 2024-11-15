import React, { createContext, useState, useContext } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workoutComplete, setWorkoutComplete] = useState(false);

  return (
    <WorkoutContext.Provider value={{ workoutComplete, setWorkoutComplete }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  return useContext(WorkoutContext);
};
