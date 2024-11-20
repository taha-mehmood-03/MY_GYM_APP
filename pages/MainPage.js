import dynamic from "next/dynamic";
import React, { Suspense, useEffect } from "react";
import Navthree from "@/components/NAVBAR/Navthree";
import axios from "axios";
import { setImages } from "@/STORE/imagesSlice";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

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
const fetchImages = async (baseUrl) => {
  console.log("Fetching images...");
  try {
    const response = await axios.get(`${baseUrl}/api/auth/gettingImages`);
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
          "X-RapidAPI-Key": "c283f37b6fmsh91e221f7a507e9ep18f65cjsn4394cb61d380",
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

export async function getServerSideProps(context) {
  console.log("getServerSideProps called - Fetching data on the server...");

  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction
    ? process.env.NEXT_PUBLIC_API_URL // Production URL from environment variable
    : `http://${context.req.headers.host}`; // Development URL based on the request header

  try {
    // Fetch data in parallel with timeout
    const [imagesData, exercisesData] = await Promise.all([
      Promise.race([
        fetchImages(baseUrl),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ]),
      Promise.race([
        fetchExercises(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ])
    ]);
    console.log("API URL:", baseUrl);
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

  // Images Query
  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: [QUERY_KEYS.IMAGES],
    queryFn: fetchImages,
    initialData: initialImages,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching images in useQuery:", error);
    },
  });

  // Exercises Query
  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: [QUERY_KEYS.EXERCISES],
    queryFn: fetchExercises,
    initialData: initialExercises,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching exercises in useQuery:", error);
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
            initialExercises={exercises}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default MainPage;
