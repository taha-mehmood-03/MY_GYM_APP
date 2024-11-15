import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredImages } from "@/store/filteredImagesSlice";
import debounce from "lodash/debounce";

// Utility function to normalize names (remove spaces, lowercase)
const normalizeName = (name) => name.trim().toLowerCase().replace(/\s+/g, "");

const useImageMap = (name) => {
  const [imageMap, setImageMap] = useState({});
  const images = useSelector((state) => state.images.images) || [];

  // Correcting this to access the "images" field from the filteredImages slice
  const filteredImagesSlice =
    useSelector((state) => state.filteredimages.images) || [];

  const dispatch = useDispatch();

  // Decode URL-encoded name and normalize it
  const decodedName = useMemo(() => decodeURIComponent(name), [name]);
  const normalizedInputName = useMemo(
    () => normalizeName(decodedName),
    [decodedName]
  );

  // Log the normalized input name
  console.log("Normalized Input Name:", normalizedInputName);

  // Memoize the filtered images to avoid recalculating on every render
  const filteredImages = useMemo(() => {
    if (Array.isArray(images) && images.length > 0) {
      const filtered = images.filter((image) => {
        const bodyPartNormalized = normalizeName(image.bodyPart);

        // Log each bodyPart and its normalized version for comparison
        console.log(
          "Body Part:",
          image.bodyPart,
          "Normalized Body Part:",
          bodyPartNormalized
        );

        return bodyPartNormalized === normalizedInputName;
      });

      console.log("Filtered Images:", filtered); // Log the filtered images
      return filtered;
    }
    return [];
  }, [images, normalizedInputName]);

  // Memoize the image map creation to avoid recalculating on every render
  const createImageMap = useCallback((images) => {
    const imageMap = images.reduce((acc, image) => {
      const bodyPart = normalizeName(image.bodyPart);
      if (bodyPart) {
        acc[bodyPart] = image.imageUrl;
      }
      return acc;
    }, {});
    console.log("Created Image Map:", imageMap); // Log the created image map
    return imageMap;
  }, []);

  // Debounce the image map update to prevent excessive updates
  const updateImageMap = useCallback(
    debounce((name, filteredImages) => {
      console.log(
        "Debouncing with name:",
        name,
        "Filtered Images:",
        filteredImages
      ); // Log the name and filtered images before updating

      if (typeof name !== "string" || name.trim() === "") {
        console.log("Invalid name, resetting imageMap"); // Log invalid name scenario
        setImageMap({}); // Reset if the name is invalid
        return;
      }

      if (filteredImages.length > 0) {
        console.log("Dispatching filtered images:", filteredImages); // Log the filtered images being dispatched
        dispatch(setFilteredImages(filteredImages));
        const newImageMap = createImageMap(filteredImages);
        setImageMap(newImageMap); // Update the image map with new data
      } else {
        console.log("No valid images found, resetting imageMap"); // Log if no images were found
        setImageMap({}); // Reset if no valid images are found
      }
    }, 500),
    [dispatch, createImageMap]
  );

  useEffect(() => {
    console.log(
      "Updating image map with name:",
      name,
      "and filteredImages:",
      filteredImages
    ); // Log when the effect runs
    updateImageMap(normalizedInputName, filteredImages);
  }, [name, filteredImages, updateImageMap, normalizedInputName]);

  console.log("Final Image Map:", imageMap); // Log the final image map before returning
  return imageMap;
};

export default useImageMap;
