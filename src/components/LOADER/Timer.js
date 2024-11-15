import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@nextui-org/react";
import { useWorkout } from "@/utils/WorkoutContext";
import { speakText } from "@/utils/textToSpeech";

export default function Timer({ resetTimer }) {
  const { workoutComplete, setWorkoutComplete } = useWorkout();
  const [state, setState] = useState({
    timeLeft: 40,
    isResting: false,
    currentSet: 0,
    currentReps: 0,
    isRunning: false,
    radius: 25, // Default radius for initial render
  });

  const totalSets = 3;
  const totalReps = 13;

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const radius =
      width < 640 ? 20 : width < 1024 ? 25 : width < 1280 ? 30 : 35;
    setState((prev) => ({ ...prev, radius: radius || 25 })); // Fallback radius if NaN
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (resetTimer) resetTimerState();
  }, [resetTimer]);

  const resetTimerState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timeLeft: 40,
      isResting: false,
      currentSet: 0,
      currentReps: 0,
      isRunning: false,
    }));
    setWorkoutComplete(false);
  }, [setWorkoutComplete]);

  useEffect(() => {
    if (!state.isRunning || state.currentSet > totalSets || workoutComplete)
      return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 0) {
          handleSetCompletion(prev);
          return prev; // Prevent further updates
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, state.currentSet, workoutComplete]);

  const handleSetCompletion = (prevState) => {
    if (prevState.isResting && prevState.currentSet < totalSets) {
      speakText(`Set ${prevState.currentSet} completed. Starting next set.`);
      setState((prev) => ({
        ...prev,
        isResting: false,
        timeLeft: 40,
        currentSet: prev.currentSet + 1,
        currentReps: 0,
      }));
    } else if (!prevState.isResting && prevState.currentSet < totalSets) {
      speakText("Rest for 30 seconds.");
      setState((prev) => ({ ...prev, isResting: true, timeLeft: 30 }));
    } else if (prevState.currentSet === totalSets && prevState.timeLeft === 0) {
      speakText("Workout complete.");
      setWorkoutComplete(true);
    }
  };

  useEffect(() => {
    if (state.isRunning && !state.isResting && state.currentSet <= totalSets) {
      const repInterval = Math.floor((40 - state.timeLeft) / 3.07);
      setState((prev) => ({
        ...prev,
        currentReps: Math.min(repInterval, totalReps),
      }));
    }
  }, [state.timeLeft, state.isRunning, state.isResting, state.currentSet]);

  const handleStartPause = useCallback(() => {
    if (!workoutComplete) {
      if (!state.isRunning) {
        speakText("Starting workout.");
      }
      setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    }
  }, [state.isRunning, workoutComplete]);

  const circumference = useMemo(
    () => 2 * Math.PI * state.radius,
    [state.radius]
  );
  const offset = useMemo(
    () =>
      state.isResting
        ? (circumference * (30 - state.timeLeft)) / 30
        : (circumference * (40 - state.timeLeft)) / 40,
    [circumference, state.isResting, state.timeLeft]
  );

  const setCircumference = useMemo(
    () => 2 * Math.PI * state.radius,
    [state.radius]
  );
  const setOffset = useMemo(
    () => (setCircumference * state.currentSet) / totalSets,
    [setCircumference, state.currentSet]
  );

  const repCircumference = useMemo(
    () => 2 * Math.PI * state.radius,
    [state.radius]
  );
  const repOffset = useMemo(
    () => (repCircumference * state.currentReps) / totalReps,
    [repCircumference, state.currentReps, totalReps]
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 rounded-full">
      <div className="flex space-x-4">
        {/* Timer Progress Circle */}
        <div className="relative flex">
          <svg width={state.radius * 2 + 10} height={state.radius * 2 + 10} className="timer-circle">
            <circle
              cx={state.radius + 5}
              cy={state.radius + 5}
              r={state.radius}
              stroke="rgba(255, 165, 0, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx={state.radius + 5}
              cy={state.radius + 5}
              r={state.radius}
              stroke={state.isResting ? "#00FF00" : "#FFA500"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-bold"
            style={{
              color: state.isResting ? "#00FF00" : "#FFA500",
              textShadow: "1px 1px 2px black",
              fontSize: `${state.radius / 2}px`,
            }}
          >
            {state.timeLeft}s
          </div>
        </div>

        {/* Sets Progress Circle */}
        <div className="relative flex items-center justify-center">
          <svg width={state.radius * 2 + 10} height={state.radius * 2 + 10} className="sets-circle">
            <circle
              cx={state.radius + 5}
              cy={state.radius + 5}
              r={state.radius}
              stroke="rgba(255, 165, 0, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx={state.radius + 5}
              cy={state.radius + 5}
              r={state.radius}
              stroke="#FFA500"
              strokeWidth="8"
              fill="none"
              strokeDasharray={setCircumference}
              strokeDashoffset={setOffset}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-bold"
            style={{
              color: "#FFA500",
              textShadow: "1px 1px 2px black",
              fontSize: `${state.radius / 2}px`,
            }}
          >
            {`${state.currentSet}/${totalSets}`}
          </div>
        </div>

        {/* Reps Progress Circle */}
        <div className="relative flex items-center justify-center">
          <svg width={state.radius * 2 + 10} height={state.radius * 2 + 10} className="reps-circle">
            <circle
              cx={state.radius + 5}
              cy={state.radius + 5}
              r={state.radius}
              stroke="rgba(255, 165, 0, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx={state.radius + 5}
              cy={state.radius + 5}
              r={state.radius}
              stroke="#FFA500"
              strokeWidth="8"
              fill="none"
              strokeDasharray={repCircumference}
              strokeDashoffset={repOffset}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-bold"
            style={{
              color: "#FFA500",
              textShadow: "1px 1px 2px black",
              fontSize: `${state.radius / 2}px`,
            }}
          >
            {`${state.currentReps}/${totalReps}`}
          </div>
        </div>
      </div>
      <Button
        onClick={handleStartPause}
        color={state.isRunning ? "danger" : "primary"}
        disabled={workoutComplete}
      >
        {state.isRunning ? "Pause" : "Start"}
      </Button>
    </div>
  );
}
