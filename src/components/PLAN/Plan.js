// components/PLAN/Plan.jsx
import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { useCalender } from "@/hooks/useCalender";
import useImageMap from "@/hooks/useImageMap";
import useExerciseAppointments from "@/hooks/useExerciseAppointments";
import { AiOutlineDelete } from "react-icons/ai";
import { useAppStore } from "@/STORE/zustand-store";
import { useSpecificExercises } from "@/hooks/useOptimizedQueries";
import Image from "next/image";
import { normalizeBodyPartName } from "@/utils/api-client";
import imageManifest from "@/../public/imageManifest.json";

// Dynamic imports with displayName
const ExercisePopover = React.lazy(() => import("./_components/ExercisePopover"));
ExercisePopover.displayName = "ExercisePopover";

const Calender = React.lazy(() => import("./_components/Calender"));
Calender.displayName = "Calender";

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

// Function to get the correct image for an exercise
const getExerciseImage = (exerciseName, imageMap) => {
  if (!exerciseName) return "/placeholder.jpg";
  
  const normalizedExercise = normalizeBodyPartName(exerciseName);
  console.log('Getting image for exercise:', exerciseName, 'normalized:', normalizedExercise);
  
  // First, try to find a body part category in the image manifest
  const manifestKey = normalizedExercise.replace(/\s/g, "").toLowerCase();
  const bodyPartImages = imageManifest[manifestKey];
  
  if (bodyPartImages && bodyPartImages.length > 0) {
    console.log('Found body part images in manifest:', bodyPartImages[0]);
    return bodyPartImages[0]; // Return the first image for this body part
  }
  
  // Fallback: try to find any body part that contains the exercise name
  for (const [bodyPart, images] of Object.entries(imageManifest)) {
    if (bodyPart !== 'bodyparts' && images && images.length > 0 && 
        bodyPart.toLowerCase().includes(normalizedExercise.toLowerCase())) {
      console.log('Found fallback match in manifest:', bodyPart, images[0]);
      return images[0];
    }
  }
  
  // Final fallback: try the comprehensive image map
  if (imageMap) {
    const bodyPartImages = imageMap[normalizedExercise];
    if (bodyPartImages && bodyPartImages.length > 0) {
      console.log('Found direct match in imageMap:', bodyPartImages[0]);
      return bodyPartImages[0];
    }
    
    // Try to find any image that contains the exercise name
    for (const [bodyPart, images] of Object.entries(imageMap)) {
      if (images && images.length > 0 && bodyPart.toLowerCase().includes(normalizedExercise.toLowerCase())) {
        console.log('Found fallback match in imageMap:', bodyPart, images[0]);
        return images[0];
      }
    }
  }
  
  // Ultimate fallback: try to find the body part overview image
  const bodyPartOverviewImages = imageManifest.bodyparts;
  if (bodyPartOverviewImages && bodyPartOverviewImages.length > 0) {
    for (const overviewImage of bodyPartOverviewImages) {
      const imageName = overviewImage.split('/').pop().replace('.webp', '').toLowerCase();
      if (imageName.includes(normalizedExercise.toLowerCase())) {
        console.log('Found body part overview image:', overviewImage);
        return overviewImage;
      }
    }
  }
  
  console.log('No image found, using placeholder');
  return "/placeholder.jpg";
};

const AppointmentCard = React.memo(({ appointment, bodyimageMap, onDelete, onCardClick }) => {
  const isDatePast = new Date(appointment.date) < new Date();

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
              src={getExerciseImage(appointment?.exercise, bodyimageMap)}
              alt={`${appointment.exercise} exercise`}
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
              {appointment?.exercise}
            </span>
            <span
              className={`text-md font-semibold mt-1 ${
                isDatePast ? "text-red-100" : "text-indigo-100"
              }`}
            >
              Scheduled on: {" "}
              <span
                className={`font-normal ${
                  isDatePast ? "text-red-400" : "text-violet-400"
                }`}
              >
                {appointment?.date ? new Date(appointment.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }) : appointment?.date}
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

AppointmentCard.displayName = "AppointmentCard";

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
  const { images } = useAppStore();
  
  // Create a comprehensive image map for all body parts
  const comprehensiveImageMap = useMemo(() => {
    const imageMap = {};
    if (images && images.length > 0) {
      images.forEach((image) => {
        if (image?.bodyPart && image?.imageUrl && Array.isArray(image.imageUrl)) {
          const bodyPart = normalizeBodyPartName(image.bodyPart);
          if (bodyPart) {
            imageMap[bodyPart] = image.imageUrl.filter(url => typeof url === 'string');
          }
        }
      });
    }
    console.log('Comprehensive image map:', imageMap);
    return imageMap;
  }, [images]);
  
  const imageMap = useImageMap(selectedImageName, images);
  const router = useRouter();
  const { setSpecificExercises } = useAppStore();
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const { currentDate, days, handlePreviousMonth, handleNextMonth, handleDateClick } = useCalender();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const { appointments, createAppointment, deleteAppointment, loading } = useExerciseAppointments();

  const apiBodyPart = normalizeBodyPartName(selectedBodyPart);
  const {
    data: specificExercises,
    isLoading: specificExercisesLoading,
    refetch: refetchSpecificExercises,
  } = useSpecificExercises(apiBodyPart, !!apiBodyPart);

  const handleExerciseSelect = useCallback(
    (exercise, formattedDate) => {
      console.log('Exercise selected:', { exercise, formattedDate });
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
    async (appointment) => {
      if (!appointment || !appointment.exercise) return;
      
      console.log('🎯 Card clicked for appointment:', appointment);
      
      const normalizedBodyPart = normalizeBodyPartName(appointment.exercise);
      console.log('🔧 Normalized body part:', normalizedBodyPart);
      
      // Set the body part state first
      setSelectedBodyPart(normalizedBodyPart);
      setSelectedImageName(normalizedBodyPart);
      console.log('💾 Set selectedBodyPart in Plan component:', normalizedBodyPart);
      
      try {
        // Directly call the API to fetch exercises for this body part
        const { exerciseApiClient } = await import('@/utils/api-client');
        console.log('📡 Calling API for body part:', normalizedBodyPart);
        const exercisesData = await exerciseApiClient.getExercisesByBodyPart(normalizedBodyPart, 1000, 0);
        
        console.log('📦 Directly fetched exercises:', exercisesData);
        console.log('📊 Number of exercises:', exercisesData?.length || 0);
        
        if (exercisesData && Array.isArray(exercisesData)) {
          // Store the exercises in the global state
          setSpecificExercises(exercisesData);
          console.log('💾 Stored exercises in Zustand store:', exercisesData.length, 'exercises');
          
          // Navigate to the specific body part page
          const targetUrl = `/SpecificPart?name=${encodeURIComponent(normalizedBodyPart)}`;
          console.log('🚀 Navigating to:', targetUrl);
          router.push(targetUrl);
        } else {
          console.error('❌ No exercises data received or invalid format');
        }
      } catch (error) {
        console.error('❌ Error fetching exercises:', error);
      }
    },
    [setSpecificExercises, router]
  );

  const handleCalenderDateClick = useCallback((day) => {
    setSelectedDate(day);
    setShowPopover(true);
  }, []);

  useEffect(() => {
    console.log('Appointments state:', appointments);
  }, [appointments]);

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
          selectedDay={selectedDate}
          setShowPopover={setShowPopover} 
          onClose={() => setShowPopover(false)}
          onExerciseSelect={handleExerciseSelect}
          exercisesList={exercisesList}
        />
      </Suspense>

      <div className="w-full max-w-4xl mt-8 grid grid-cols-1 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => <AppointmentCardSkeleton key={idx} />)
          : appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                bodyimageMap={comprehensiveImageMap}
                onDelete={handleDelete}
                onCardClick={() => handleCardClick(appointment)}
              />
            ))}
      </div>
    </div>
  );
};

export default Plan;