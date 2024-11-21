import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useState } from "react";
import Navthree from "@/components/NAVBAR/Navthree";
import axios from "axios";
import { setImages } from "@/STORE/imagesSlice";
import { useDispatch } from "react-redux";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { debounce } from "lodash";

// Dynamic import with SSR enabled
const BodyPartlists = dynamic(() =>
  import("@/components/BODYPARTLIST/BodyPartlists"),
  { ssr: true }
);

// Query keys for React Query
const QUERY_KEYS = {
  IMAGES: 'images',
  EXERCISES: 'exercises'
};

// API functions
const fetchImages = async () => {
  console.log("Fetching images...");
  try {
    const response = await axios.get("https://my-gym-app-co8y-icfsgooy7-taha-mehmoods-projects-175bb778.vercel.app/api/auth/gettingImages");
    console.log("Fetched images response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

const fetchExercises = async () => {
  console.log("Fetching exercises...");
  try {
    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
      {
        headers: {
          "X-RapidAPI-Key": "c8ebee3918msh76b6f3fcec77a0cp1389f0jsnad7f7298eb82",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );
    console.log("Fetched exercises response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

// Debounced function for fetching exercises
const debouncedFetchExercises = debounce(fetchExercises, 500);

// Rate limiting function
const rateLimit = (fn, limit, period) => {
  let count = 0;
  let startTime = Date.now();

  return async (...args) => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;

    if (elapsed > period * 1000) {
      count = 0;
      startTime = currentTime;
    }

    if (count < limit) {
      count++;
      return fn(...args);
    } else {
      console.log("Rate limit exceeded. Waiting...");
      await new Promise((resolve) => setTimeout(resolve, period * 1000 - elapsed));
      return fn(...args);
    }
  };
};

const rateLimitedFetchExercises = rateLimit(debouncedFetchExercises, 1000, 3600);

export async function getServerSideProps() {
  console.log("getServerSideProps called - Fetching data on the server...");

  try {
    // Fetch data in parallel with timeout
    const [imagesData, exercisesData] = await Promise.all([
      Promise.race([
        fetchImages(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ]),
      Promise.race([
        rateLimitedFetchExercises(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ])
    ]);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log("Images data fetched on the server:", imagesData);
    console.log("Exercises data fetched on the server:", exercisesData);

    return {
      props: {
        initialImages: imagesData || [],
        initialExercises: exercisesData || [],
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialImages: [],
        initialExercises: [],
        error: error.message,
      },
    };
  }
}

const MainPage = ({ initialImages, initialExercises, error }) => {
  const dispatch = useDispatch();
  const [imagesLoading, setImagesLoading] = useState(false);
  const [exercisesLoading, setExercisesLoading] = useState(false);

  // Images Query
  const { data: images, isLoading: imagesQueryLoading } = useQuery({
    queryKey: [QUERY_KEYS.IMAGES],
    queryFn: fetchImages,
    initialData: initialImages,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching images in useQuery:", error);
    },
  });

  // Update Redux store when images change
  useEffect(() => {
    console.log("Images updated:", images);
    if (images?.length > 0) {
      // Dispatching the images fetched from SSR or React Query
      dispatch(setImages(images));
    }
  }, [images, dispatch]);

  // Loading state
  if (imagesLoading || exercisesLoading) {
    console.log("Loading data...");
    return (
      <div className="min-h-screen bg-black text-white">
        <Navthree />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse">Loading Data...</div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error("Error loading data:", error);
    return (
      <div className="min-h-screen bg-black text-white">
        <Navthree />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading data. Please try again later.</div>
          </div>
        </main>
      </div>
    );
  }

  // Render the page when everything is ready
  console.log("Page rendered with images and exercises");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navthree />
      <main className="container mx-auto py-8 px-4">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse">Loading Body Part Lists...</div>
            </div>
          }
        >
          <BodyPartlists
            initialImages={images}
            initialExercises={initialExercises}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default MainPage;
