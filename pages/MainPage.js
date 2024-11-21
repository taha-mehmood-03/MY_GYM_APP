// MainPage.js
import dynamic from "next/dynamic";
import React, { Suspense, useEffect } from "react";
import Navthree from "@/components/NAVBAR/Navthree";
import axios from "axios";
import { setImages, setExercises } from "@/STORE/dataSlice";
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
const fetchImages = async () => {
  try {
    const response = await axios.get("https://my-gym-app-co8y-icfsgooy7-taha-mehmoods-projects-175bb778.vercel.app/api/auth/gettingImages");
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

const fetchExercises = async () => {
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
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export async function getServerSideProps() {
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
        fetchExercises(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        ),
      ])
    ]);

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

  // Update Redux store when images and exercises change
  useEffect(() => {
    if (images?.length > 0) {
      dispatch(setImages(images));
    }
    if (exercises?.length > 0) {
      dispatch(setExercises(exercises));
    }
  }, [images, exercises, dispatch]);

  // Loading state
  if (imagesLoading || exercisesLoading) {
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