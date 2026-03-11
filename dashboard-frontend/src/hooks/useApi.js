import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for API calls with loading, error, and success handling
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, { onSuccess, onError, successMessage, showToast = true } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      const data = response.data;

      if (successMessage && showToast) {
        toast.success(successMessage);
      }

      if (onSuccess) onSuccess(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);

      if (showToast) {
        toast.error(message);
      }

      if (onError) onError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
}

export default useApi;

