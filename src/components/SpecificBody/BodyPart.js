import React, { useCallback, useMemo, useState, Suspense } from "react";
import { CardFooter, Image } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { setSpecificExercise } from "@/store/specificExerciseSlice";
import { clearSearch } from "@/store/specificbodySlice";
import { setSrc } from "@/store/mediaSlice";
import { useRouter } from "next/router";
import { getvideoForCategory, getvideoManifest } from "@/utils/videoLoader";
import Img1 from "./gymlogo.jpg";
import CardSkeleton from "../SKELETON/CardSkeleton";
import dynamic from "next/dynamic";

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
const ExerciseCard = ({ exercise, matchedImage, index, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      key={exercise.id || index}
      className="flex justify-center w-full transform transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {matchedImage ? (
        <DynamicCard
          isFooterBlurred
          className="group w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-hidden"
          isPressable
          onPress={onClick}
        >
          <div className="relative w-full bg-gradient-to-br from-indigo-900 to-violet-900 p-1 rounded-xl">
            <div className="relative w-full rounded-lg overflow-hidden">
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
                removeWrapper
                alt={exercise.name}
                className={`z-0 object-cover w-full transition-all duration-700 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } ${isHovered ? "transform scale-105" : ""}`}
                src={matchedImage}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.error("Image loading error:", e);
                  e.target.onerror = null;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardFooter className="absolute bottom-0 z-10 w-full bg-black/60 backdrop-blur-sm border-t border-violet-600/30 p-6">
                <div className="flex flex-grow gap-4 items-center">
                  <div className="relative overflow-hidden rounded-full w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-500 p-0.5">
                   
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
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-full hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 font-medium"
                  onClick={() => onClick(exercise)}
                >
                  Start
                </button>
              </CardFooter>
            </div>
          </div>
        </DynamicCard>
      ) : (
        <CardSkeleton />
      )}
    </div>
  );
};

// Main component to render all exercises
const SpecificPart = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch data from the Redux store
  const {
    specificExercises,
    filteredExercises,
    filteredImages,
    exerciseStatus,
    exerciseError,
    imageStatus,
    imageError,
  } = useSelector((state) => ({
    specificExercises: state.specificBody.specificExercises || [],
    filteredExercises: state.specificBody.filteredExercises || [],
    filteredImages: state.filteredimages.images || [],
    exerciseStatus: state.specificBody.status,
    exerciseError: state.specificBody.error,
    imageStatus: state.filteredimages.status,
    imageError: state.filteredimages.error,
  }));

  const normalizeName = (name) =>
    name.toLowerCase().replace(/\s+/g, "").replace(/\//g, "");

  // Handle click on exercise to set and navigate
  const handleExerciseClick = useCallback(
    async (exercise) => {
      try {
        const manifest = await getvideoManifest();
        const name = normalizeName(exercise.name);
        const videoSrc = getvideoForCategory(manifest, name);

        dispatch(setSpecificExercise(exercise));
        dispatch(setSrc(videoSrc));
        dispatch(clearSearch());
        router.push("/Specificworkout");
      } catch (error) {
        console.error("Error handling exercise click:", error);
      }
    },
    [dispatch, router]
  );

  // Match images for exercises
  const matchedImages = useMemo(() => {
    const exercisesToMatch =
      filteredExercises.length > 0 ? filteredExercises : specificExercises;
    return exercisesToMatch.map((exercise, index) => {
      const normalizedExerciseName = normalizeName(exercise.name);
      const filteredImageData = filteredImages.find(
        (item) =>
          normalizeName(item.bodyPart) === normalizeName(exercise.bodyPart)
      );

      if (filteredImageData) {
        const matchedImage = filteredImageData.imageUrl.find((url) =>
          url.toLowerCase().includes(normalizedExerciseName)
        );
        return matchedImage;
      } else {
        return null;
      }
    });
  }, [filteredExercises, specificExercises, filteredImages]);

  const exercisesToRender =
    filteredExercises.length > 0 ? filteredExercises : specificExercises;

  // Loading and error handling
  if (exerciseStatus === "loading" || imageStatus === "loading") {
    return <LoadingGrid />;
  }

  if (exerciseError || imageError) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading content. Please try again.
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingGrid />}>
      <div className="grid bg-black grid-cols-1 gap-4 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {exercisesToRender.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id || index}
            exercise={exercise}
            matchedImage={matchedImages[index]}
            index={index}
            onClick={() => handleExerciseClick(exercise)}
          />
        ))}
      </div>
    </Suspense>
  );
};

export default SpecificPart;
