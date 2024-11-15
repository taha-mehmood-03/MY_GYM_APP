import React, { useState, useMemo, useCallback } from "react";
import {
  format,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  differenceInDays,
} from "date-fns";

const Calendar = React.memo(
  ({ currentDate, handleDateClick, handlePreviousMonth, handleNextMonth }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const today = new Date();

    const isCurrentMonth = useMemo(
      () => isSameMonth(currentDate, today),
      [currentDate, today]
    );

    const handleDateSelect = useCallback(
      (day) => {
        const selectedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        if (!(isCurrentMonth && selectedDate < today)) {
          handleDateClick(selectedDate);
        }
      },
      [handleDateClick, isCurrentMonth, today, currentDate]
    );

    const isDateInRange = useCallback(
      (day) => {
        const selectedDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        );
        return startDate && endDate
          ? selectedDate >= startDate && selectedDate <= endDate
          : false;
      },
      [startDate, endDate, currentDate]
    );

    const renderCalendarDays = () => {
      const firstDay = startOfWeek(startOfMonth(currentDate));
      const lastDay = endOfWeek(endOfMonth(currentDate));
      const totalDays = differenceInDays(lastDay, firstDay) + 1;

      const calendarDays = [];
      for (let i = 0; i < totalDays; i++) {
        const day = new Date(firstDay.getTime() + i * 24 * 60 * 60 * 1000);
        calendarDays.push(day);
      }

      return calendarDays;
    };

    const calendarDays = renderCalendarDays();

    return (
      <div className="flex justify-center mb-6 w-full">
        <div className="w-full max-w-4xl h-auto bg-white shadow-lg rounded-lg p-8 border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePreviousMonth}
              disabled={isCurrentMonth}
              className={`bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300 mr-2 text-gray-700 ${
                isCurrentMonth ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Previous Month"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.3 18.3l-1.4 1.4L8 12l5.9-7.7 1.4 1.4L10.8 12z" />
              </svg>
            </button>
            <h2 className="flex-grow text-center text-2xl font-semibold text-gray-800">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              onClick={handleNextMonth}
              className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300 ml-2 text-gray-700"
              aria-label="Next Month"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.7 18.3l1.4 1.4L16 12l-5.9-7.7-1.4 1.4L13.2 12z" />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <th
                        key={index}
                        className="text-sm font-medium text-gray-600 border-b border-gray-300 p-3"
                      >
                        {day}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  { length: Math.ceil(calendarDays.length / 7) },
                  (_, i) => (
                    <tr key={i}>
                      {calendarDays
                        .slice(i * 7, (i + 1) * 7)
                        .map((day, index) => {
                          const isPastDate = isCurrentMonth && day < today;
                          return (
                            <td
                              key={`${i}-${index}`}
                              onClick={() =>
                                !isPastDate && handleDateSelect(day.getDate())
                              }
                              className={`p-3 border-b border-gray-300 text-center cursor-pointer rounded-lg ${
                                isDateInRange(day.getDate())
                                  ? "bg-indigo-600 text-white font-bold"
                                  : isSameDay(day, today)
                                  ? "bg-gray-200 font-bold"
                                  : isPastDate
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "hover:bg-gray-100 transition duration-200"
                              }`}
                            >
                              {day.getDate()}
                            </td>
                          );
                        })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

// Set the display name manually
Calendar.displayName = 'Calendar';

const CalendarWithSuspense = ({ ...props }) => (
  <React.Suspense
    fallback={
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800 font-semibold text-2xl">
        Loading calendar...
      </div>
    }
  >
    <Calendar {...props} />
  </React.Suspense>
);

export default CalendarWithSuspense;
