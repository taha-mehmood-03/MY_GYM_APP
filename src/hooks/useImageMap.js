import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppStore } from "@/STORE/zustand-store";
import debounce from "lodash/debounce";
import { normalizeBodyPartName } from "@/utils/api-client";

const useImageMap = (name) => {
  const [imageMap, setImageMap] = useState({});
  const images = useAppStore((state) => state.images) || [];
  const setFilteredImages = useAppStore((state) => state.setFilteredImages);

  const decodedName = useMemo(() => {
    try {
      return decodeURIComponent(name || '');
    } catch {
      return name || '';
    }
  }, [name]);

  const normalizedInputName = useMemo(() => {
    return normalizeBodyPartName(decodedName);
  }, [decodedName, name]);

  const filteredImages = useMemo(() => {
    if (!normalizedInputName) {
      const overview = images.find(img => normalizeBodyPartName(img.bodyPart) === 'bodyparts');
      return overview ? [overview] : [];
    }
    return images.filter((image) => {
      const bodyPartNormalized = normalizeBodyPartName(image.bodyPart);
      return bodyPartNormalized === normalizedInputName;
    });
  }, [images, normalizedInputName]);

  const createImageMap = useCallback((images) => {
    const result = images.reduce((acc, image) => {
      if (!image?.bodyPart) return acc;
      const bodyPart = normalizeBodyPartName(image.bodyPart);
      if (bodyPart && Array.isArray(image.imageUrl)) {
        acc[bodyPart] = image.imageUrl.filter(url => typeof url === 'string');
      }
      return acc;
    }, {});
    return result;
  }, []);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      if (filteredImages.length > 0) {
        const newImageMap = createImageMap(filteredImages);
        setFilteredImages(filteredImages);
        setImageMap(newImageMap);
      } else {
        setImageMap({});
      }
    }, 300);

    debouncedUpdate();
    return () => debouncedUpdate.cancel();
  }, [filteredImages, createImageMap, setFilteredImages, normalizedInputName]);

  return imageMap;
};

export default useImageMap;