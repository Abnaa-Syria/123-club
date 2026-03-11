import { API_BASE_URL } from '../constants';

/**
 * Convert relative image path to full URL
 * @param {string} path - Relative path (e.g., "avatars/uuid.jpg") or full URL
 * @returns {string|null} Full URL or null if path is empty
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  // Prefer explicit upload base URL if provided
  const rawBase =
    import.meta.env.VITE_UPLOAD_BASE_URL ||
    API_BASE_URL ||
    'http://localhost:5000';

  // Strip trailing slash
  let base = rawBase.replace(/\/$/, '');

  // If base ends with /api or /api/v1, remove it to get the server root
  base = base.replace(/\/api(\/v1)?$/, '');

  // Avoid duplicated `/uploads/uploads/...`
  const cleanPath = path.replace(/^\/?uploads\//, '');

  return `${base}/uploads/${cleanPath}`;
};

