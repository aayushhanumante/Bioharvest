import { useState, useCallback, useEffect } from 'react';

/**
 * Generic hook for handling async operations.
 * Provides loading, error, and data states.
 * @param {function} asyncFn - async function to execute
 * @param {boolean} immediate - run on mount if true
 */
export const useAsync = (asyncFn, immediate = false) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) execute();
  }, []);

  return { data, error, loading, execute };
};