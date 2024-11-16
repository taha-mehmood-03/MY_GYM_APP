import React, { useState, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import debounce from "lodash.debounce";
import { Card, CardFooter, Button} from "@nextui-org/react";
import Image from "next/image";
import useFetchImages from "@/hooks/useFetchImages";
import img from "./gymlogo.jpg";
import useFetchExercises from "@/hooks/useFetchExercises";
import useImageMap from "@/hooks/useImageMap";
import { fetchExercises } from "../../STORE/exerciseSlice";
import { setExercises } from "../../STORE/specificbodySlice";
import CardSkeleton from "../SKELETON/CardSkeleton";
//  component with responsive design


// Dynamic card with skeleton loading
const DynamicCard = dynamic(
  () => import("@nextui-org/react").then((mod) => mod.Card),
  {
    loading: () => <CardSkeleton />,
    ssr: true,
  }
);

// Responsive loading grid
const LoadingGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    {Array(count).fill(0).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

// Enhanced Exercise Card Component
const ExerciseCard = ({ exercise, index, imageSrc, handleExercise }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      key={exercise.id || index} 
      className="flex justify-center w-full "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <DynamicCard className="group w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden  transform transition-all duration-300 hover:scale-[1.02]">
        <div className="relative w-full bg-gradient-to-br from-indigo-900 to-violet-900 p-1 rounded-xl">
          <div className="relative w-full rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-violet-900">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute top-2 left-2 w-12 h-12 border-4 border-violet-500 rounded-full animate-spin-reverse border-t-transparent"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-4  border-indigo-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            
            <Image
              alt="Exercise image"
              className={`z-0 object-cover w-full transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              } ${isHovered ? 'transform scale-105' : ''}`}
              src={imageSrc}
              layout="responsive"
              width={800}
              height={600}
              loading={index < 3 ? "eager" : "lazy"}
              priority={index < 3}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error("Image loading error:", e);
                e.target.onerror = null;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <CardFooter className="absolute bottom-0 z-10 w-full bg-black/60 backdrop-blur-sm border-t border-violet-600/30 p-6">
            <div className="flex flex-grow gap-4 items-center">
              <div className="relative overflow-hidden rounded-full w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-500 p-0.5">
             
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-blue-400 font-medium">Build Your</p>
                <h4 className="text-white font-bold text-xl group-hover:text-blue-400 transition-colors duration-300">
                  {exercise}
                </h4>
              </div>
            </div>
            <Button
              radius="full"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition duration-300 shadow-lg"
              onClick={() => handleExercise(exercise)}
            >
              Start
            </Button>
          </CardFooter>
        </div>
      </DynamicCard>
    </div>
  );
};

// Main component
const BodyPartlists = ({ initialImages, initialExercises }) => {
  const dispatch = useDispatch();
  const [exerciseName, setExerciseName] = useState("bodyparts");

  // Fetch data using custom hooks
  const {
    data: images,
    status: imageStatus,
    error: imageError,
  } = useFetchImages(initialImages);
  
  const {
    data: exercises,
    status: exerciseStatus,
    error: exerciseError,
  } = useFetchExercises(
    "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
    "exercise",
    initialExercises
  );

  const imageMap = useImageMap(exerciseName);
  const specificBody = useSelector((state) => state.specificBody);
  const memoizedExercises = useMemo(() => exercises || [], [exercises]);

  // Handle exercise selection with debounce
  const handleExercise = useCallback(
    debounce((name) => {
      if (!name || typeof name !== "string") {
        console.error("Invalid exercise name:", name);
        return;
      }

      const formattedName = encodeURIComponent(name.trim().toLowerCase());
      setExerciseName(formattedName);

      const apiEndpoint = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${formattedName}`;
      
      dispatch(
        fetchExercises({
          endpoint: apiEndpoint,
          slice: "specificBody",
        })
      )
        .then((response) => {
          const exercises = response.payload.data;
          dispatch(setExercises(exercises));
          return Router.push("/SpecificPart");
        })
        .catch((error) => {
          console.error("Error fetching exercises:", error);
        });
    }, 500),
    [dispatch]
  );

  // Render exercise list with memoization
  const renderExerciseList = useMemo(() => {
    return memoizedExercises.map((exercise, index) => {
      const bodypartsArray = imageMap?.bodyparts || [];
      const imageSrc =
        bodypartsArray.length > 0
          ? bodypartsArray[index % bodypartsArray.length]
          : "/default-bodypart-image.jpg";

      return (
        <ExerciseCard
          key={exercise.id || index}
          exercise={exercise}
          index={index}
          imageSrc={imageSrc}
          handleExercise={handleExercise}
        />
      );
    });
  }, [memoizedExercises, imageMap, handleExercise]);

  // Show loading state
  if (exerciseStatus === "loading" || imageStatus === "loading") {
    return <LoadingGrid />;
  }

  // Show error state
  if (exerciseError || imageError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading content. Please try again.
      </div>
    );
  }

  // Render main content
  return (
    <Suspense fallback={<LoadingGrid />}>
      <div className="grid bg-black grid-cols-1 gap-4 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderExerciseList}
      </div>
    </Suspense>
  );
};

export default BodyPartlists;