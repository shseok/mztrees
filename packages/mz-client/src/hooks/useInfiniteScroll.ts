import { useEffect } from 'react';

export const useInfinteScroll = (ref: React.RefObject<HTMLDivElement>, fetchNext: () => void) => {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNext();
        }
        // entries.forEach((entry) => {
        //   if (entry.isIntersecting) {
        //     fetchNext();
        //   }
        // });
      },
      {
        rootMargin: '200px',
        threshold: 1.0,
      },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [fetchNext, ref]);
};
