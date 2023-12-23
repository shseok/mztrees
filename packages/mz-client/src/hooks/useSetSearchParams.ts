'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useSearchParams from './useSearchParams';

// Get a new searchParams string by merging the current searchParams with a provided key/value pair
// ex) setSearchParams({mode: '...', tag: '...' | null})
export default function useSetSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = useCallback(
    (obj: Record<string, string | null>) => {
      const currentParams = Object.fromEntries<string | null>(
        searchParams.entries()
      );
      for (const [key, value] of Object.entries(obj)) {
        currentParams[key] = value;
      }
      // console.log(currentParams);
      const query = [];
      for (const [key, value] of Object.entries(currentParams)) {
        if (!value) continue;
        query.push(`${key}=${value}`);
      }
      router.push(pathname + '?' + query.join('&'));
    },
    [router, pathname, searchParams]
  );

  return setSearchParams;
}
