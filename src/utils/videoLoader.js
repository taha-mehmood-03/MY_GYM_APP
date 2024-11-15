export async function getvideoManifest() {
    try {
      const response = await fetch('/videoManifest.json');
      if (!response.ok) {
        throw new Error('Failed to fetch video manifest');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading video manifest:', error);
      return {};
    }
  }


  export function getvideoForCategory(manifest, name) {
    return manifest[name] || [];
  }