import React, { useCallback, useMemo, useState, Suspense } from "react";
import { CardFooter } from "@nextui-org/react";
import Image from "next/image";
import { useAppStore } from "@/STORE/zustand-store";
import { useSpecificExercises } from "@/hooks/useOptimizedQueries";
import { useRouter } from "next/router";
import { getvideoForCategory, getvideoManifest } from "@/utils/videoLoader";
import CardSkeleton from "../SKELETON/CardSkeleton";
import dynamic from "next/dynamic";
import useImageMap from "@/hooks/useImageMap";
import { normalizeBodyPartName } from "@/utils/api-client";
import imageManifest from "@/../public/imageManifest.json";

// Dynamically load the Card component for performance optimization
const DynamicCard = dynamic(
  () => import("@nextui-org/react").then((mod) => mod.Card),
  {
    loading: () => <CardSkeleton />,
    ssr: true,
  }
);

// Responsive loading grid to show placeholders while content is being loaded
const LoadingGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-6 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    {Array(count)
      .fill(0)
      .map((_, index) => (
        <CardSkeleton key={index} />
      ))}
  </div>
);

// ExerciseCard component to display each exercise with dynamic image loading
const ExerciseCard = React.memo(({ exercise, matchedImage, index, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    setImageLoaded(true);
  }, []);

  return (
    <div
      key={exercise.id || index}
      className="flex justify-center w-full transform transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DynamicCard
        isFooterBlurred
        className="group w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden"
      >
        <div className="relative w-full bg-gradient-to-br from-indigo-900 to-violet-900 p-1 rounded-xl">
          <div className="relative w-full h-72 md:h-96 lg:h-[40rem] rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-violet-900">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-500 rounded-full animate-spin-reverse border-t-transparent"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-4 border-pink-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <Image
              alt={exercise.name}
              className={`z-0 object-cover w-full transition-all duration-700 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              } ${isHovered ? "transform scale-105" : ""}`}
              src={matchedImage}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 3}
              loading={index < 3 ? undefined : "lazy"}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <CardFooter className="absolute bottom-0 z-10 w-full bg-black/60 backdrop-blur-sm border-t border-violet-600/30 p-6">
              <div className="flex flex-grow gap-4 items-center">
                <div className="relative flex-shrink-0 overflow-hidden rounded-full w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-violet-500 p-0.5">
                  <Image
                    src="/gymlogo.jpg"
                    alt="Gym Logo"
                    className="w-full h-full object-cover rounded-full"
                    fill
                    sizes="56px"
                    priority={index < 3}
                    loading={index < 3 ? undefined : "lazy"}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-violet-300 font-medium">
                    {`Exercise : ${index + 1}`}
                  </p>
                  <h4 className="text-white font-bold text-xl group-hover:text-indigo-300 transition-colors duration-300">
                    {exercise.name}
                  </h4>
                </div>
              </div>
              <button
                type="button"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-full hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 font-medium"
                onClick={() => onClick(exercise)}
              >
                Start
              </button>
            </CardFooter>
          </div>
        </div>
      </DynamicCard>
    </div>
  );
});

ExerciseCard.displayName = "ExerciseCard";

// Main component to render all exercises
const SpecificPart = () => {
  const router = useRouter();
  const { 
    specificExercises, 
    filteredExercises, 
    loading, 
    errors, 
    setSpecificExercise, 
    setSrc, 
    clearError,
    selectedBodyPart,
    setFilteredImages,
    setSelectedBodyPart
  } = useAppStore();

  // Read body part from URL parameter and set it in store
  React.useEffect(() => {
    const { name } = router.query;
    console.log('🌐 URL query params:', router.query);
    console.log('📝 Name from URL:', name);
    
    if (name && typeof name === 'string') {
      console.log('✅ Setting body part from URL:', name);
      setSelectedBodyPart(name);
    } else {
      console.log('⚠️ No valid name parameter in URL');
    }
  }, [router.query, setSelectedBodyPart]);

  // Use the mapped/normalized value for API calls
  const apiBodyPart = normalizeBodyPartName(selectedBodyPart);
  const { data: specificExercisesData, isLoading, error } = useSpecificExercises(apiBodyPart, !!apiBodyPart);
  const exercisesData = useMemo(() => specificExercisesData || specificExercises || [], [specificExercisesData, specificExercises]);
  const imageMap = useImageMap(apiBodyPart);
  const normalizedBodyPart = apiBodyPart?.trim().toLowerCase().replace(/\s+/g, "");

  useEffect(() => {
    const imagesForBodyPart = imageMap[normalizedBodyPart] || [];
    if (imagesForBodyPart.length > 0) {
      setFilteredImages(imagesForBodyPart);
    }
  }, [setFilteredImages, imageMap, normalizedBodyPart]);

  const normalizeName = (name) =>
    name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

  const handleExerciseClick = useCallback(
    async (exercise) => {
      try {
        console.log('🎯 Exercise clicked:', exercise.name);
        
        const manifest = await getvideoManifest();
        console.log('📹 Video manifest loaded:', Object.keys(manifest).length, 'videos available');
        
        const name = normalizeName(exercise.name);
        console.log('🔍 Normalized exercise name:', name);
        
        const videoSrc = getvideoForCategory(manifest, name);
        console.log('🎬 Video URL found:', videoSrc ? 'Yes' : 'No', videoSrc);
        
        if (!videoSrc) {
          console.warn('⚠️ No video found for exercise:', exercise.name);
        }

        // Store exercise and video URL in Zustand
        setSpecificExercise(exercise);
        setSrc(videoSrc);
        
        console.log('💾 Stored in Zustand - Exercise:', exercise.name);
        console.log('💾 Stored in Zustand - Video URL:', videoSrc);
        
        clearError("specificExercises");
        router.push("/Specificworkout");
      } catch (error) {
        console.error("❌ Error in handleExerciseClick:", error);
      }
    },
    [setSpecificExercise, setSrc, clearError, router]
  );

  // Strict exact name matching logic
  const exercisesWithExactMatches = useMemo(() => {
    const exercisesToMatch = filteredExercises?.length > 0 ? filteredExercises : exercisesData;
    return exercisesToMatch
      .map((exercise) => {
        const exerciseName = normalizeBodyPartName(exercise.name).replace(/\s/g, "");
        const matchedImage = imageMap[normalizedBodyPart]?.find((url) => {
          const imageName = url.split('/').pop().replace('.webp', '');
          return normalizeBodyPartName(imageName).replace(/\s/g, "") === exerciseName;
        });
        return matchedImage ? { ...exercise, matchedImage } : null;
      })
      .filter(Boolean);
  }, [filteredExercises, exercisesData, imageMap, normalizedBodyPart]);

  if (isLoading || loading.specificExercises) {
    return <LoadingGrid />;
  }

  if (error || errors.specificExercises) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading content. Please try again.
      </div>
    );
  }

  if (!exercisesWithExactMatches.length) {
    return (
      <div className="text-center text-white p-8">
        <h3 className="text-xl font-semibold mb-4">No exercises found with exact name matches</h3>
        <p className="text-gray-400">Please try selecting a different body part.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingGrid />}>
      <div className="grid bg-black grid-cols-1 gap-4 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Display only exercises with exact name matches */}
        {exercisesWithExactMatches.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id || index}
            exercise={exercise}
            matchedImage={exercise.matchedImage}
            index={index}
            onClick={handleExerciseClick}
          />
        ))}
      </div>
    </Suspense>
  );
};

export default SpecificPart;