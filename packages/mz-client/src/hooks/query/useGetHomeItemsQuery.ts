import type { GetItemsResult, ListMode, Tag } from '@/types/db';
import type { QueryKey } from '@tanstack/react-query';
import { getItems } from '@/lib/api/items';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

interface useGetItemsQueryProps {
  mode: ListMode;
  tag: Tag | null;
  dateRange: string[];
}

export default function useGetHomeItemsQuery({
  mode,
  tag,
  dateRange,
}: useGetItemsQueryProps) {
  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<GetItemsResult, Error, GetItemsResult, QueryKey>(
    ['Items', mode, tag, mode === 'past' ? dateRange : undefined].filter(
      (item) => !!item
    ),
    ({ pageParam = undefined }: { pageParam?: number }) =>
      getItems({
        mode,
        tag: tag ?? undefined,
        cursor: pageParam,
        ...(mode === 'past'
          ? { startDate: dateRange[0], endDate: dateRange[1] }
          : {}),
      }),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.endCursor;
      },
      refetchOnWindowFocus: false,
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
    isFetchingNextPage,
  };
}
