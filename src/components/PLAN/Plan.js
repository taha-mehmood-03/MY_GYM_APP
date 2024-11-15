import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { useCalender } from "@/hooks/useCalender";
import useImageMap from "@/hooks/useImageMap";
import useExerciseAppointments from "@/hooks/useExerciseAppointments";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { fetchExercises } from "@/store/exerciseSlice";
import Image from "next/image";

// Dynamic imports using React.lazy
const ExercisePopover = React.lazy(() => import("./_components/ExercisePopover"));
const Calender = React.lazy(() => import("./_components/Calender"));

const exercisesList = [
  "Upper Arms",
  "Lower Arms",
  "Chest",
  "Neck",
  "Lower Legs",
  "Upper Legs",
  "Shoulder",
  "Cardio",
  "Back",
];

const normalizeName = (name) => {
  const normalized = name?.toLowerCase().trim() || "";
  return normalized;
};

const AppointmentCard = React.memo(({ appointment, bodyimageMap, onDelete, onCardClick }) => {
  const isDatePast = new Date(appointment.appointmentDate) < new Date();

  return (
    <div
      className={`bg-gradient-to-br p-6 rounded-lg shadow-md w-full border transition-transform transform hover:scale-105 hover:shadow-indigo-500/25 duration-300 flex flex-col cursor-pointer ${
        isDatePast
          ? "from-red-900 to-red-700 hover:from-red-800 hover:to-red-600"
          : "from-indigo-900 to-violet-900 hover:from-indigo-800 hover:to-violet-800"
      }`}
      onClick={onCardClick}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-indigo-700 overflow-hidden shadow-lg mb-4 xs:mb-0">
            <Image
              src={
                bodyimageMap?.bodyparts?.find((img) =>
                  img.toLowerCase().includes(normalizeName(appointment?.exerciseName))
                ) || "/placeholder.jpg"
              }
              alt={`${appointment.exerciseName} exercise`}
              layout="fill"
              objectFit="cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${
                isDatePast ? "text-red-300" : "text-violet-300"
              }`}
            >
              {appointment?.exerciseName}
            </span>
            <span
              className={`text-md font-semibold mt-1 ${
                isDatePast ? "text-red-100" : "text-indigo-100"
              }`}
            >
              Scheduled on:{" "}
              <span
                className={`font-normal ${
                  isDatePast ? "text-red-400" : "text-violet-400"
                }`}
              >
                {appointment?.appointmentDate}
              </span>
            </span>
          </div>
        </div>
        
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
            aria-label="Delete Exercise"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(appointment._id);
            }}
          >
            <AiOutlineDelete size={20} />
          </button>
       
      </div>
    </div>
  );
});

const AppointmentCardSkeleton = () => (
  <div className="bg-gradient-to-br from-indigo-900 to-violet-900 p-6 rounded-lg shadow-md w-full border animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-indigo-700 overflow-hidden mb-4 xs:mb-0 bg-indigo-700"></div>
        <div className="flex flex-col">
          <span className="bg-indigo-700 rounded w-32 h-5 block mb-2"></span>
          <span className="bg-indigo-700 rounded w-48 h-5 block"></span>
        </div>
      </div>
      <div className="bg-indigo-700 rounded-full w-10 h-10"></div>
    </div>
  </div>
);

const Plan = () => {
  const [selectedImageName, setSelectedImageName] = useState("bodyparts");
  const imageMap = useImageMap(selectedImageName);
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentDate, days, handlePreviousMonth, handleNextMonth, handleDateClick } = useCalender();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const { appointments, createAppointment, deleteAppointment } = useExerciseAppointments();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [appointments]);

  const handleExerciseSelect = useCallback(
    (exercise, formattedDate) => {
      createAppointment(exercise, formattedDate);
    },
    [createAppointment]
  );

  const handleDelete = useCallback(
    async (id) => {
      await deleteAppointment(id);
    },
    [deleteAppointment]
  );

  const handleCardClick = useCallback(
    (appointment) => {
      if (!appointment || !appointment.exerciseName) {
        return;
      }

      const normalizedName = normalizeName(appointment.exerciseName);
      const formattedName = encodeURIComponent(normalizedName);
      setSelectedImageName(formattedName);

      const apiEndpoint = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${formattedName}`;
      dispatch(
        fetchExercises({
          endpoint: apiEndpoint,
          slice: "specificBody",
        })
      )
        .then((response) => {
          Router.push(`/SpecificPart?name=${formattedName}`);
        })
        .catch((error) => {
          console.error("Error fetching exercises:", error);
        });
    },
    [dispatch, router]
  );

  const handleCalenderDateClick = useCallback((day) => {
    setSelectedDate(day);
    setShowPopover(true);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-black min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-100 md:text-5xl lg:text-6xl">
        My Schedule
      </h1>

      <Suspense fallback={<div className="py-16">Loading calendar...</div>}>
        <Calender
          currentDate={currentDate}
          days={days}
          handleDateClick={handleCalenderDateClick}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
        />
      </Suspense>

      <Suspense fallback={<div className="py-16">Loading exercises...</div>}>
        <ExercisePopover
          showPopover={showPopover}
          setShowPopover={setShowPopover}
          selectedDay={selectedDate}
          exercisesList={exercisesList}
          onExerciseSelect={handleExerciseSelect}
        />
      </Suspense>

      <div className="mt-8 w-full max-w-2xl">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <AppointmentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {appointments
              .filter((appointment) => new Date(appointment.appointmentDate) >= new Date())
              .map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  bodyimageMap={imageMap}
                  onDelete={handleDelete}
                  onCardClick={() => handleCardClick(appointment)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

Plan.displayName = "Plan";
export default React.memo(Plan);