import type { QueryKey } from '@tanstack/react-query';
import type { GetBookmarksResult } from '@/types/db';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getBookmarks } from '@/lib/api/bookmark';
import { useCallback } from 'react';

export default function useGetBookmarkItemsQuery() {
  const {
    status,
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<GetBookmarksResult, Error, GetBookmarksResult, QueryKey>(
    ['bookmarks'],
    ({ pageParam = undefined }: { pageParam?: number }) =>
      getBookmarks(pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.endCursor;
      },
      refetchOnWindowFocus: false,
      suspense: true,
      useErrorBoundary: true,
    }
  );

  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  return {
    status,
    infiniteData,
    fetchNextData,
  };
}
