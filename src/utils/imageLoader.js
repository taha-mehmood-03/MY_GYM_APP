// utils/imageLoader.js
export async function getImageManifest() {
    try {
      const response = await fetch('/imageManifest.json');
      if (!response.ok) {
        throw new Error('Failed to fetch image manifest');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading image manifest:', error);
      return {};
    }
  }
  
  export function getImagesForCategory(manifest, category) {
    return manifest[category] || [];
  }
  



  