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
const fetchImages = async (req) => {
  try {
    const response = await axios.get(`https://${req.headers.host}/api/auth/gettingImages`);
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

export async function getServerSideProps(context) {
  const baseUrl = `https://${context.req.headers.host}` || process.env.NEXT_PUBLIC_API_URL;
  console.log("baseUrl",baseUrl)
  console.log(`https://${context.req.headers.host}`)
  try {
    const [imagesData, exercisesData] = await Promise.all([
      axios.get(`${baseUrl}/api/auth/gettingImages`).then(res => res.data),
      fetchExercises(),
    ]);

    return {
      props: {
        initialImages: imagesData || [],
        initialExercises: exercisesData || [],
      },
    };
  } catch (error) {
    console.error("Server-side fetch error:", error);
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
    queryFn: () => fetchImages(),
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

  useEffect(() => {
    if (images?.length > 0) {
      dispatch(setImages(images));
    }
  }, [images, dispatch]);

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


