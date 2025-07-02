import { useCallback } from 'react';

const useStoreImages = () => {
  const storeImages = useCallback(async (imagesToStore) => {
    if (imagesToStore && Array.isArray(imagesToStore)) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/auth/storingImages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imagesToStore),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Images stored successfully:', data);
        } else {
          console.error('Error storing images:', data.message);
        }
      } catch (error) {
        console.error('Error sending images to API:', error);
      }
    }
  }, []);

  return { storeImages };
};

export default useStoreImages;
