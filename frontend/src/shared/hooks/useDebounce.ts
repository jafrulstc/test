import { useState, useEffect } from 'react';
import { UI_CONSTANTS } from '~/app/constants';

/**
 * Custom hook for debouncing values
 * Useful for search inputs and API calls that should be delayed
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (defaults to UI_CONSTANTS.DEBOUNCE_DELAY)
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number = UI_CONSTANTS.DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};