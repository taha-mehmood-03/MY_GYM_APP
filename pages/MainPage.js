// MainPage.js
import dynamic from "next/dynamic";
import React, { Suspense, useEffect } from "react";
import Navthree from "@/components/NAVBAR/Navthree";
import axios from "axios";
import { setImages } from "@/STORE/imagesSlice";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";

const BodyPartlists = dynamic(() =>
  import("@/components/BODYPARTLIST/BodyPartlists"),
  { ssr: true }
);

const QUERY_KEYS = {
  IMAGES: 'images',
  EXERCISES: 'exercises'
};

const fetchImages = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('API URL is not defined');
  }

  try {
    const response = await axios.get(`${apiUrl}/api/auth/gettingImages`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      }
    });
    return response.data || [];
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
        timeout: 5000,
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export async function getServerSideProps() {
  try {
    const [imagesData, exercisesData] = await Promise.all([
      fetchImages(),
      fetchExercises()
    ]);

    return {
      props: {
        initialImages: imagesData,
        initialExercises: exercisesData,
      },
    };
  } catch (error) {
    console.error("Server-side data fetch error:", error);
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

  const imagesQuery = useQuery({
    queryKey: [QUERY_KEYS.IMAGES],
    queryFn: fetchImages,
    initialData: initialImages,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const exercisesQuery = useQuery({
    queryKey: [QUERY_KEYS.EXERCISES],
    queryFn: fetchExercises,
    initialData: initialExercises,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    if (imagesQuery.data?.length > 0) {
      dispatch(setImages(imagesQuery.data));
    }
  }, [imagesQuery.data, dispatch]);

  const isLoading = imagesQuery.isLoading || exercisesQuery.isLoading;
  const fetchError = error || imagesQuery.error || exercisesQuery.error;

  if (isLoading) {
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

  if (fetchError) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navthree />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error: {fetchError.message}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navthree />
      <main className="container mx-auto py-8 px-4">
        <Suspense fallback={<div>Loading Body Part Lists...</div>}>
          <BodyPartlists
            initialImages={imagesQuery.data}
            initialExercises={exercisesQuery.data}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default MainPage;