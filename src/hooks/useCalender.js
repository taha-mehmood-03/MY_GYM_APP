// hooks/useCalender.js
import { useState, useEffect } from "react";

export const useCalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  useEffect(() => {
    const daysInMonth = new Array(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    )
      .fill(0)
      .map((_, i) => i + 1);
    setDays(daysInMonth);
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day, setSelectedDay, setShowPopover) => {
    setSelectedDay(day);
    setShowPopover(true);
  };

  return {
    currentDate,
    days,
    handlePreviousMonth,
    handleNextMonth,
    handleDateClick,
  };
};