// useFetchImages.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setImages, } from "@/STORE/imagesSlice";
import axios from "axios";

const fetchImagesFromAPI = async () => {
  const response = await axios.get("/api/auth/gettingImages");
  console.log(response.data)
  
  return response.data;
};

const useFetchImages = (initialImages) => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images.images); // Accessing the Redux store for images

  return useQuery({
    queryKey: ["images"],
    queryFn: fetchImagesFromAPI,
    initialData: images.length > 0 ? images : initialImages, // Use Redux data or SSR initialImages
    onSuccess: (data) => {
      dispatch(setImages(data)); // Dispatch images to Redux store on success
      dispatch(setStatus("succeeded"));
    },
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setStatus("failed"));
    },
    refetchOnWindowFocus: false,
    staleTime: 60000,
    cacheTime: 300000,
    retry: 3,
    retryDelay: 1000,
  });
};

export default useFetchImages;
