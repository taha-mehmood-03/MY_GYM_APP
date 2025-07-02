import dynamic from "next/dynamic";
import React, { Suspense, useEffect } from "react";
import Navthree from "@/components/NAVBAR/Navthree";
import { useImages, useExercises } from "@/hooks/useOptimizedQueries";
import useImageMap from "@/hooks/useImageMap";
import { exerciseApiClient, internalApiClient } from "@/utils/api-client";
import axios from "axios";
import { useAppStore } from "@/STORE/zustand-store";
import clientPromise from "@/db/mongodb";

// Dynamic import with SSR enabled
const BodyPartlists = dynamic(() =>
  import("@/components/BODYPARTLIST/BodyPartlists"),
  { ssr: true }
);

export async function getStaticProps() {
  try {
    // Fetch images directly from MongoDB
    const client = await clientPromise;
    const db = client.db('TAHAKHAN');
    const imagesCollection = db.collection('ExerciseImages');
    const imagesData = await imagesCollection.find({}).limit(1000).toArray();

    // Convert _id and Date fields to string for all images
    const serializableImages = imagesData.map(img => ({
      ...img,
      _id: img._id.toString(),
      ...(img.createdAt && { createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt }),
      ...(img.updatedAt && { updatedAt: img.updatedAt instanceof Date ? img.updatedAt.toISOString() : img.updatedAt }),
    }));

    // Fetch exercises from the external API
    const exercisesData = await exerciseApiClient.getBodyPartList();

    return {
      props: {
        initialImages: serializableImages || [],
        initialExercises: exercisesData || [],
      },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: {
        initialImages: [],
        initialExercises: [],
        error: error.message,
      },
      revalidate: 3600,
    };
  }
}

const MainPage = ({ initialImages, initialExercises, error }) => {
  // Use optimized hooks for data fetching
  const { 
    data: images, 
    isLoading: imagesLoading, 
    error: imagesError 
  } = useImages(initialImages);

  const { 
    data: exercises, 
    isLoading: exercisesLoading, 
    error: exercisesError 
  } = useExercises(initialExercises);

  const imageMap = useImageMap(""); // or useImageMap("bodyparts")
  const overviewImages = imageMap["bodyparts"] || [];

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
  if (error || imagesError || exercisesError) {
    console.error("Error loading data:", error || imagesError || exercisesError);
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
        <BodyPartlists
          initialImages={overviewImages}
          initialExercises={exercises}
        />
      </main>
    </div>
  );
};

export default MainPage;
