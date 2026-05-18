/**
 * getProductImageUrl
 * 
 * Centralized helper to generate full URLs for Laravel storage images.
 * Handles environment variable substitution and path cleaning.
 * 
 * @param {string} path - The relative path from the database (e.g., 'products/camera.jpg')
 * @returns {string} - The full absolute URL for the image
 */
export const getProductImageUrl = (path) => {
  if (!path) return null;

  // If the path is already a full URL (e.g., from a CDN or Unsplash), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get the base API URL and derive the storage URL
  // Example: 'http://localhost:8000/api' -> 'http://localhost:8000'
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').trim();
  
  // Remove trailing slash and /api
  let baseUrl = apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

  // Clean the path to avoid double slashes at the start
  let cleanPath = path.replace(/^\/+/, '');
  
  // If the path already starts with 'storage/', remove it as we'll add it manually
  // or handle it consistently.
  if (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8);
  }

  // Final construction: Base URL + /storage/ + encoded path
  // Using encodeURI to handle spaces in filenames correctly
  return `${baseUrl}/storage/${encodeURI(cleanPath)}`;
};
