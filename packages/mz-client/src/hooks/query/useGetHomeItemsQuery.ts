import { useCallback } from 'react';
import type { GetItemsResult, SortMode, Tag } from '@/types/db';
import type { QueryKey } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getItems } from '@/lib/api/items';
import { INITIAL_ITEM_LIMIT } from '@/lib/const';

interface useGetItemsQueryProps {
  mode: SortMode;
  tag?: Tag | null;
  dateRange: string[];
  initialCursor?: number;
}

// 처음 홈 화면에 렌더링할 때 사용하는 쿼리
export function useGetFirstHomeItemsQuery({
  mode,
  tag,
  dateRange,
}: useGetItemsQueryProps) {
  const {
    data: currentItems,
    status,
    error,
  } = useQuery<GetItemsResult, Error, GetItemsResult, QueryKey>(
    [
      'firstHomeItems',
      mode,
      tag,
      mode === 'past' ? dateRange : undefined,
    ].filter((item) => !!item),
    () =>
      getItems({
        mode,
        tag: tag ?? undefined,
        limit: INITIAL_ITEM_LIMIT,
        ...(mode === 'past'
          ? { startDate: dateRange[0], endDate: dateRange[1] }
          : {}),
      })
  );

  return {
    status,
    currentItems,
    error,
  };
}

// 더보기 버튼을 눌렀을 때 사용하는 쿼리
export function useGetNextHomeItemsQuery({
  mode,
  tag,
  dateRange,
  initialCursor,
}: useGetItemsQueryProps) {
  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<GetItemsResult, Error, GetItemsResult, QueryKey>(
    [
      'nextHomeItems',
      mode,
      tag,
      mode === 'past' ? dateRange : undefined,
    ].filter((item) => !!item),
    ({ pageParam = initialCursor }: { pageParam?: number }) =>
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
