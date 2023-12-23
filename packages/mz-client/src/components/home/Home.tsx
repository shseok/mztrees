'use client';

import styles from '@/styles/StyledTabLayout.module.scss';
import {
  useInfiniteQuery,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import type { GetItemsResult, ListMode, Tag } from '@/types/db';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import LinkCardList from '@/components/home/LinkCardList';
import ListModeSelector from '@/components/home/ListModeSelector';
import WeekSelector from '@/components/home/WeekSelector';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useSearchParams } from 'next/navigation';
import { getItems } from '@/lib/api/items';
import { getWeekRangeFromDate } from '@/lib/week';
import SkeletonUI from '@/components/system/SkeletonUI';
import EmptyList from '../system/EmptyList';
import TabLayout from '../layout/TabLayout';
import TagSelector from './TagSelector';
import ErrorShower from '@/app/error';

export default function Home() {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get('mode') as ListMode | null) ?? 'trending'
  );
  const [tag, setTag] = useState<Tag | null>(
    searchParams.get('tag') as Tag | null
  );

  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const [dateRange, setDateRange] = useState(
    startDate && endDate ? [startDate, endDate] : defaultDateRange
  );
  const { reset } = useQueryErrorResetBoundary();

  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
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
    }
  );

  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    const nextMode = (searchParams.get('mode') as ListMode) ?? 'trending';
    if (nextMode !== mode) {
      setMode(nextMode);
    }
  }, [searchParams, mode]);

  useEffect(() => {
    if (mode === 'past') {
      setDateRange(
        startDate && endDate ? [startDate, endDate] : defaultDateRange
      );
    }
  }, [startDate, endDate, defaultDateRange, mode]);

  const items = infiniteData?.pages.flatMap((page) => page.list);
  return (
    <TabLayout className='layout_padding'>
      <div className={styles.content}>
        <ListModeSelector mode={mode} tag={tag} />
        <TagSelector
          listMode={mode}
          selectedTag={tag}
          setSelectedTag={setTag}
        />
        {mode === 'past' && <WeekSelector dateRange={dateRange} />}
        {status === 'loading' ? (
          <SkeletonUI />
        ) : status === 'error' ? (
          // TODO: define error type
          <ErrorShower error={error as Error} reset={reset} />
        ) : items ? (
          <LinkCardList items={items} />
        ) : null}
        <div ref={observerTargetEl} />
      </div>
      {items?.length === 0 ? <EmptyList /> : null}
    </TabLayout>
  );
}
