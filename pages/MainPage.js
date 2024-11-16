// MainPage.js
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
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
const fetchImages = async () => {
  try {
    const response = await axios.get("https://localhost:3000/api/auth/gettingImages");
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

export async function getServerSideProps() {
  try {
    // Fetch data in parallel with timeout
    const [imagesData, exercisesData] = await Promise.all([
      Promise.race([
        fetchImages(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]),
      Promise.race([
        fetchExercises(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ])
    ]);

    // Prefetch data for React Query
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
      console.error("Error fetching images:", error);
    }
  });

  // Exercises Query
  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: [QUERY_KEYS.EXERCISES],
    queryFn: fetchExercises,
    initialData: initialExercises,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching exercises:", error);
    }
  });

  // Update Redux store when images change
  React.useEffect(() => {
    if (images?.length > 0) {
      dispatch(setImages(images));
    }
  }, [images, dispatch]);

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