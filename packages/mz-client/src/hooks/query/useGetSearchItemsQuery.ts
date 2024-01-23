import type { QueryKey } from '@tanstack/react-query';
import type { SearchItemsResult } from '@/types/db';
import { searchItems } from '@/lib/api/search';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useGetSearchItemsQuery(search: string) {
  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<SearchItemsResult, Error, SearchItemsResult, QueryKey>(
    ['searchItems', search],
    ({ pageParam = undefined }: { pageParam?: number }) =>
      searchItems({ q: search, offset: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.nextOffset;
      },
      refetchOnWindowFocus: false,
      enabled: search.trim() !== '',
    }
  );
  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  return {
    status,
    infiniteData,
    error,
    fetchNextData,
  };
}
