import React, { useState, useMemo, useCallback, Suspense, startTransition } from "react";
import Router from "next/router";
import debounce from "lodash.debounce";
import { Card, CardFooter, Button } from "@nextui-org/react";
import Image from "next/image";
import { useImages, useExercises, useSpecificExercises } from "@/hooks/useOptimizedQueries";
import { useAppStore } from "@/STORE/zustand-store";
import useImageMap from "@/hooks/useImageMap";
import CardSkeleton from "../SKELETON/CardSkeleton";
import ClientOnly from "../ClientOnly";
import { normalizeBodyPartName } from "@/utils/api-client";

const LoadingGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="bg-gradient-to-br from-indigo-900 to-violet-900 p-6 rounded-lg shadow-md w-full border animate-pulse">
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
    ))}
  </div>
);

const ExerciseCard = React.memo(({ exercise, index, imageSrc, handleExercise }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback((e) => {
    console.error(`Image loading error for ${exercise}:`, imageSrc, e);
    e.target.onerror = null;
  }, [exercise, imageSrc]);

  return (
    <div
      key={exercise.id || index}
      className="flex justify-center w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="group w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <div className="relative w-full bg-gradient-to-br from-indigo-900 to-violet-900 p-1 rounded-xl">
          <div className="relative w-full rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-violet-900">
                <div className="loader"></div>
              </div>
            )}
            <Image
              alt={`${exercise} exercise image`}
              className={`z-0 object-cover w-full transition-all duration-700 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              } ${isHovered ? "transform scale-105" : ""}`}
              src={imageSrc}
              width={800}
              height={600}
              priority={index < 3}
              loading={index < 3 ? undefined : "lazy"}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <CardFooter className="absolute bottom-0 z-10 w-full bg-black/60 backdrop-blur-sm border-t border-violet-600/30 p-6">
            <div className="flex flex-grow gap-4 items-center">
              <div className="relative overflow-hidden rounded-full w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-500 p-0.5"></div>
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
      </Card>
    </div>
  );
});

const BodyPartLists = ({ initialImages, initialExercises }) => {
  const { setSpecificExercises, setSelectedBodyPart } = useAppStore();
  const [selectedBodyPart, setSelectedBodyPartLocal] = useState(null);
  
  // Use optimized hooks for data fetching
  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = useImages(initialImages);
  
  const {
    data: exercises,
    isLoading: exercisesLoading,
    error: exercisesError,
  } = useExercises(initialExercises);
  
  // Always call useImageMap (fix conditional hook)
  const imageMap = useImageMap(selectedBodyPart, images);

  // Get body part images for the main page (when no specific body part is selected)
  const bodyPartImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    // Find the "bodyparts" entry which contains the main body part images
    const bodyPartsEntry = images.find(img => img.bodyPart === 'bodyparts');
    return bodyPartsEntry?.imageUrl || [];
  }, [images]);

  const memoizedExercises = useMemo(() => {
    return exercises || [];
  }, [exercises]);

  const handleExercise = useCallback(
    (name) => {
      if (!name || typeof name !== "string") {
        return;
      }
      
      startTransition(() => {
        // Map the exercise name to the correct API body part name
        const bodyPartName = normalizeBodyPartName(name.trim());
        setSelectedBodyPartLocal(bodyPartName);
        setSelectedBodyPart(bodyPartName); // Set in store
        Router.push("/SpecificPart");
      });
    },
    [setSelectedBodyPart]
  );

  const renderExerciseList = useMemo(() => {
    return memoizedExercises.map((exercise, index) => {
      const imageSrc =
        bodyPartImages.length > 0
          ? bodyPartImages[index % bodyPartImages.length]
          : "/imagesofbodyparts/imagesofbodyParts/back.webp";
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
  }, [memoizedExercises, bodyPartImages, handleExercise]);

  if (exercisesLoading || imagesLoading) {
    return <LoadingGrid />;
  }

  if (exercisesError || imagesError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading content. Please try again.
      </div>
    );
  }

  return (
    <ClientOnly fallback={<LoadingGrid />}>
      <div className="grid bg-black grid-cols-1 gap-4 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderExerciseList}
      </div>
    </ClientOnly>
  );
};

export default React.memo(BodyPartLists);