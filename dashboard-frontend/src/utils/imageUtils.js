/**
 * Convert relative image path to full URL
 * @param {string} path - Relative path (e.g., "avatars/uuid.jpg") or full URL
 * @returns {string|null} Full URL or null if path is empty
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Use backend URL from env or default to localhost:5000
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return `${backendUrl}/uploads/${path}`;
};

