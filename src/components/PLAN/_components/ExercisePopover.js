import React, { useMemo, useCallback } from "react";

const ExercisePopover = React.memo(({
  showPopover,
  setShowPopover,
  selectedDay,
  exercisesList,
  onExerciseSelect,
}) => {
  // Memoize the formatted date to avoid recalculating on every render
  const formattedDate = useMemo(() => {
    return selectedDay
      ? selectedDay.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : ""; // Format date correctly
  }, [selectedDay]);

  // Click handler to close popover
  const handlePopoverClose = useCallback(() => {
    setShowPopover(false);
  }, [setShowPopover]);

  // Click handler for exercise selection
  const handleExerciseSelect = useCallback((exercise) => {
    onExerciseSelect(exercise, formattedDate);
    handlePopoverClose(); // Close popover after selection
  }, [onExerciseSelect, formattedDate, handlePopoverClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 ${showPopover ? "block" : "hidden"}`}
      onClick={handlePopoverClose} // Click outside to close
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Schedule for {formattedDate} {/* Display formatted date */}
        </h3>
        <ul className="mt-2 space-y-2">
          {exercisesList.map((exercise) => (
            <li
              key={exercise}
              className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition rounded-lg"
              onClick={() => handleExerciseSelect(exercise)} // Use the memoized function
            >
              {exercise}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg"
          onClick={handlePopoverClose} // Use the memoized function
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

// Set the display name for debugging purposes
ExercisePopover.displayName = "ExercisePopover";

export default ExercisePopover;
