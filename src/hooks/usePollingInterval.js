import { useEffect, useRef } from 'react';

/**
 * Runs a callback on a fixed interval, cleaning up on unmount.
 * @param {Function} callback - Invoked each tick (receives no args).
 * @param {number} delay - Interval in milliseconds.
 */
export function usePollingInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
