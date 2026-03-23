import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observerRef = useRef(null);
  const targetRef = useRef(null);

  const setTarget = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node || !hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          callback();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observerRef.current.observe(node);
    targetRef.current = node;
  }, [callback, hasMore, isLoading]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return setTarget;
};
