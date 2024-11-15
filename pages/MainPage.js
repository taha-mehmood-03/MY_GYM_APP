// MainPage.js
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import Navthree from "@/components/NAVBAR/Navthree";
import axios from "axios";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { setImages } from "@/store/imagesSlice"; // Importing the setImages action
import { useDispatch } from "react-redux";

const BodyPartlists = dynamic(() =>
  import("@/components/BODYPARTLIST/BodyPartlists")
);

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  // Moved inside getServerSideProps

  try {
    // Fetching images
    const imagesResponse = await axios.get(
      "http://localhost:3000/api/auth/gettingImages"
    );
    const initialImages = imagesResponse.data;

    // Dispatch the images to the Redux store
    // Dispatching images

    // Fetching exercises
    const exercisesResponse = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
      {
        headers: {
          "X-RapidAPI-Key":
            "c283f37b6fmsh91e221f7a507e9ep18f65cjsn4394cb61d380",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );
    const initialExercises = exercisesResponse.data;

    return {
      props: {
        initialImages,
        initialExercises,
        dehydratedState: dehydrate(queryClient), // Prefetching query state for hydration
      },
    };
  } catch (error) {
    console.error("Error fetching images or exercises:", error);
    return { props: { initialImages: [], initialExercises: [] } };
  }
};

const MainPage = ({ initialImages, initialExercises }) => {
  const dispatch = useDispatch();
  
  // Dispatch the initial images to the Redux store on the client side
  React.useEffect(() => {
    dispatch(setImages(initialImages));
    // console.log("initialImages",initialImages)
  }, [initialImages, dispatch]);

  return (
    <div className=" bg-black text-white">
      <Navthree />
      <main className="py-8 px-4">
        <Suspense fallback={<div>Loading Body Part Lists...</div>}>
          <BodyPartlists
            initialImages={initialImages}
            initialExercises={initialExercises}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default MainPage;
