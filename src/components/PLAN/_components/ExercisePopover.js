// components/PLAN/_components/ExercisePopover.js
import React, { useMemo, useCallback } from "react";

const ExercisePopover = React.memo(({
  showPopover,
  setShowPopover,
  selectedDay,
  exercisesList,
  onExerciseSelect,
  onClose,
}) => {
  const formattedDate = useMemo(() => {
    return selectedDay
      ? selectedDay.toISOString().split('T')[0] // YYYY-MM-DD format
      : "";
  }, [selectedDay]);

  const handlePopoverClose = useCallback(() => {
    setShowPopover(false);
    onClose?.();
  }, [setShowPopover, onClose]);

  const handleExerciseSelect = useCallback((exercise) => {
    onExerciseSelect(exercise, formattedDate);
    handlePopoverClose();
  }, [onExerciseSelect, formattedDate, handlePopoverClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 ${
        showPopover ? "block" : "hidden"
      }`}
      onClick={handlePopoverClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Schedule for {formattedDate}
        </h3>
        <ul className="mt-2 space-y-2">
          {exercisesList.map((exercise) => (
            <li
              key={exercise}
              className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition rounded-lg"
              onClick={() => handleExerciseSelect(exercise)}
            >
              {exercise}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg"
          onClick={handlePopoverClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

ExercisePopover.displayName = "ExercisePopover";

export default ExercisePopover;