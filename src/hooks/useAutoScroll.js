import { useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to a scrollable container.
 * Scrolls to the bottom whenever `dependency` changes.
 */
export function useAutoScroll(dependency) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dependency]);

  return scrollRef;
}
