import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
  Image,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { setSpecificExercise } from "@/store/specificExerciseSlice";
import { getvideoForCategory, getvideoManifest } from "@/utils/videoLoader";
import { setSrc } from "@/store/mediaSlice";
import { useWorkout } from "@/utils/WorkoutContext";
import { YouTubeEmbed } from "@next/third-parties/google";
import { faDumbbell, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaHandsHelping } from "react-icons/fa"; 

// Skeleton Loader Component
const ExerciseSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Video Skeleton */}
      <Card className="w-[100vw] max-w-screen-ssm mb-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg">
        <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 aspect-video w-full rounded-lg" />
      </Card>

      {/* GIF and Timer Skeleton */}
      <Card className="w-full max-w-screen-ssm bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg">
        <CardBody className="py-4 flex flex-col ssm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-4">
          <div className="relative flex justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl w-full sm:w-72 md:w-80 lg:w-96">
            <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 aspect-square w-full rounded-xl" />
          </div>
          <div className="flex justify-center items-center rounded-full p-4 w-full sm:w-auto">
            <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-32 w-32 rounded-full" />
          </div>
        </CardBody>
      </Card>

      {/* Exercise Details Cards Skeleton */}
      <div className="w-full flex-col sm:flex sm:flex-row sm:justify-around gap-3 max-w-screen-ssm">
        {[1, 2, 3].map((index) => (
          <div key={index} className="mt-4 sm:mt-0 sm:w-1/3">
            <Card className="h-full bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg">
              <CardHeader className="flex gap-3">
                <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-10 w-10 rounded-sm" />
                <div className="w-full">
                  <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-4 w-24 rounded" />
                </div>
              </CardHeader>
              <Divider className="bg-purple-500/20" />
              <CardBody>
                <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-4 w-full rounded mb-2" />
                <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-4 w-3/4 rounded" />
              </CardBody>
              <Divider className="bg-purple-500/20" />
            </Card>
          </div>
        ))}
      </div>

      {/* Instructions Accordion Skeleton */}
      <div className="w-full max-w-screen-ssm bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg">
        <div className="p-4">
          <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-6 w-32 rounded mb-4" />
          <div className="space-y-2">
            <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-4 w-full rounded" />
            <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-4 w-5/6 rounded" />
            <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-4 w-4/6 rounded" />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="w-full max-w-screen-ssm flex justify-between space-x-4 mt-8">
        <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-12 w-1/3 sm:w-32 rounded-lg" />
        <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-12 w-1/3 sm:w-32 rounded-lg" />
      </div>
    </div>
  );
};

// Dynamically import Timer with loading state
const Timer = dynamic(() => import("../LOADER/Timer"), {
  loading: () => (
    <div className="animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 h-32 w-32 rounded-full" />
  ),
  ssr: false,
});

const MemoizedImage = React.memo(({ src, alt, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl" />
      )}
      <Image
        alt={alt}
        src={src}
        {...props}
        onLoad={() => setIsLoading(false)}
        className={`${props.className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
});

MemoizedImage.displayName = "MemoizedImage";

// Main SpecificExercise component
const SpecificExercise = React.memo(() => {
  const [resetTimer, setResetTimer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { workoutComplete, setWorkoutComplete } = useWorkout();
  const dispatch = useDispatch();
  const specificExercisesData = useSelector((state) => state.specificBody.specificExercises);
  const specificsrc = useSelector((state) => state.media.src);
  const specificExercise = useSelector((state) => state.specificExercise.specificExercise);

  const exerciseDetails = useMemo(() => {
    if (!specificExercise) return [];
    return [
      {
        title: "Secondary Muscles",
        content: specificExercise.secondaryMuscles?.join(", ") || "",
        icon: <FaHandsHelping className=" text-xl text-blue-400" />
      },
      { 
        title: "Targeted Muscles",
        content: specificExercise.target || "",
        icon: <FontAwesomeIcon icon={faBullseye} className="text-xl text-purple-400" />
      },
      { 
        title: "Equipment",
        content: specificExercise.equipment || "",
        icon: <FontAwesomeIcon icon={faDumbbell} className="text-xl text-indigo-400" />
      },
    ];
  }, [specificExercise]);

  const normalizeName = useCallback((name) => {
    return name.toLowerCase().replace(/\s+/g, "").replace(/\//g, "");
  }, []);

  const handleExerciseChange = useCallback(
    async (indexChange) => {
      setIsLoading(true);
      const newIndex = currentIndex + indexChange;
      
      if (newIndex >= 0 && newIndex < specificExercisesData.length) {
        try {
          setCurrentIndex(newIndex);
          const exercise = specificExercisesData[newIndex];
          dispatch(setSpecificExercise(exercise));

          const manifest = await getvideoManifest();
          const name = normalizeName(exercise.name);
          const videoSrc = getvideoForCategory(manifest, name);
          dispatch(setSrc(videoSrc));

          setResetTimer(true);
          setTimeout(() => setResetTimer(false), 100);
          setWorkoutComplete(newIndex === specificExercisesData.length - 1);
        } catch (error) {
          console.error("Error changing exercise:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [currentIndex, dispatch, specificExercisesData, setWorkoutComplete, normalizeName]
  );

  const extractVideoId = (url) => {
    if (typeof url !== 'string') {
      console.warn('URL is not a valid string:', url);
      return null;
    }
  
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regex);
    
    return match && match[7] && match[7].length === 11 ? match[7] : null;
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (specificExercise) {
      setIsLoading(false);
    }
  }, [specificExercise]);

  if (!specificExercise || isLoading) {
    return <ExerciseSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Video Section */}
      <Card className="w-[100vw] max-w-screen-ssm mb-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg overflow-hidden hover:shadow-purple-500/10 transition-shadow duration-300">
        <YouTubeEmbed
          videoid={extractVideoId(specificsrc)}
          loading="lazy"
          allowFullScreen
          className="w-full aspect-video"
        />
      </Card>

      {/* GIF and Timer Section */}
      <Card className="w-full max-w-screen-ssm bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg hover:shadow-purple-500/10 transition-shadow duration-300">
        <CardBody className="py-4 flex flex-col ssm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-4">
          {specificExercise.gifUrl ? (
            <div className="relative flex justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl w-full sm:w-72 md:w-80 lg:w-96">
              <MemoizedImage
                alt="Exercise GIF"
                className="object-cover rounded-xl mix-blend-screen filter invert saturate-[300%] hue-rotate-[180deg] brightness-[90%] contrast-[150%]"
                src={specificExercise.gifUrl }
                width={300}
                height={300}
               
              />
            </div>
          ) : (
            <p className="text-center text-gray-400">GIF not available</p>
          )}

          <div className="flex justify-center items-center rounded-full p-4 w-full sm:w-auto">
            <Timer resetTimer={resetTimer} />
          </div>
        </CardBody>
      </Card>

      {/* Exercise Details Cards */}
      <div className="w-full flex-col sm:flex sm:flex-row sm:justify-around gap-3 max-w-screen-ssm">
        {exerciseDetails.map(({ title, content, icon }, index) => (
          <div key={index} className="mt-4 sm:mt-0 sm:w-1/3">
            <Card className="h-full bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/10">
              <CardHeader className="flex gap-3 text-white">
                <div className="text-2xl">{icon}</div>
                <div>
                  <p className="text-md font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{title}</p>
                </div>
              </CardHeader>
              <Divider className="bg-purple-500/20" />
              <CardBody className="text-gray-300">
                <p className="leading-relaxed">{content}</p>
              </CardBody>
              <Divider className="bg-purple-500/20" />
            </Card>
          </div>
        ))}
      </div>

      {/* Instructions Accordion */}
      <Accordion
        variant="shadow"
        className="w-full max-w-screen-ssm bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/20 shadow-lg rounded-lg hover:shadow-purple-500/10 transition-shadow duration-300"
      >
        <AccordionItem
          key="1"
          aria-label="Instructions"
          title={
            <span className="text-md font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              📝 Instructions
            </span>
          }
          className="bg-transparent text-white"
        >
          <p className="text-gray-300 leading-relaxed">
            {specificExercise.instructions}
          </p>
        </AccordionItem>
      </Accordion>

      {/* Navigation Buttons */}
      <div className="w-full max-w-screen-ssm flex justify-between space-x-4 mt-8">
        <Button
          size="lg"
          color="primary"
          variant="bordered"
          className="w-1/3 sm:w-auto bg-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition duration-300 shadow-lg"
          onClick={() => handleExerciseChange(-1)}
          disabled={currentIndex === 0 || isLoading}
          startContent={isLoading ? null : "←"}
        >
          {isLoading ? "Loading..." : "Previous"}
        </Button>

        <Button
          size="lg"
          color={workoutComplete ? "success" : "primary"}
          variant="bordered"
          className={`w-1/3 sm:w-auto ${
            workoutComplete ? "bg-green-600" : "bg-gradient-to-r from-blue-600 to-purple-600"
          } text-white hover:opacity-90 transition duration-300 shadow-lg`}
          onClick={() => handleExerciseChange(1)}
          disabled={!workoutComplete}
                    endContent={isLoading ? null : "→"}
        >
          {isLoading ? "Loading..." : workoutComplete ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
});

SpecificExercise.displayName = "SpecificExercise";

export default SpecificExercise;