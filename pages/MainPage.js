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
  IMAGES: "images",
  EXERCISES: "exercises",
};

// API functions
const fetchImages = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/gettingImages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

const fetchExercises = async () => {
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
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

// Server-side rendering for exercises
export async function getServerSideProps() {
  console.log("Fetching exercises server-side...");
  try {
    const exercisesData = await fetchExercises();
    return {
      props: {
        initialExercises: exercisesData || [],
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialExercises: [],
        error: error.message,
      },
    };
  }
}

const MainPage = ({ initialExercises, error }) => {
  const dispatch = useDispatch();

  // Client-side query for images
  const { data: images, isLoading: imagesLoading, error: imagesError } = useQuery({
    queryKey: [QUERY_KEYS.IMAGES],
    queryFn: fetchImages,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Update Redux store when images change
  useEffect(() => {
    if (images?.length > 0) {
      dispatch(setImages(images));
    }
  }, [images, dispatch]);

  // Loading state
  if (imagesLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navthree />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse">Loading Images...</div>
          </div>
        </main>
      </div>
    );
  }

  // Error state for images
  if (imagesError) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navthree />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading images. Please try again later.</div>
          </div>
        </main>
      </div>
    );
  }

  // Error state for exercises
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navthree />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading exercises. Please try again later.</div>
          </div>
        </main>
      </div>
    );
  }

  // Render the page when everything is ready
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
