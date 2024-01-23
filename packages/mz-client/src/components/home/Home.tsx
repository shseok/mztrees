'use client';

import type { ListMode, Tag } from '@/types/db';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/StyledTabLayout.module.scss';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useSearchParams } from 'next/navigation';
import { getWeekRangeFromDate } from '@/lib/week';
import { colors } from '@/lib/colors';
import LinkCardList from '@/components/home/LinkCardList';
import ListModeSelector from '@/components/home/ListModeSelector';
import WeekSelector from '@/components/home/WeekSelector';
import SkeletonUI from '@/components/system/SkeletonUI';
import EmptyList from '../system/EmptyList';
import TabLayout from '../layout/TabLayout';
import TagSelector from './TagSelector';
import ErrorShower from '@/app/error';
import LoadingIndicator from '../system/LoadingIndicator';
import useGetHomeItemsQuery from '@/hooks/query/useGetHomeItemsQuery';

export default function Home() {
  const searchParams = useSearchParams();
  const { reset } = useQueryErrorResetBoundary();
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const observerTargetEl = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<ListMode>(
    (searchParams.get('mode') as ListMode | null) ?? 'trending'
  );
  const [tag, setTag] = useState<Tag | null>(
    searchParams.get('tag') as Tag | null
  );
  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const [dateRange, setDateRange] = useState(
    startDate && endDate ? [startDate, endDate] : defaultDateRange
  );
  const { infiniteData, status, error, fetchNextData, isFetchingNextPage } =
    useGetHomeItemsQuery({ mode, tag, dateRange });

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
        <div className={styles.loadMore} ref={observerTargetEl}>
          {isFetchingNextPage ? (
            <LoadingIndicator color={colors.primary} />
          ) : null}
        </div>
      </div>
      {items?.length === 0 ? <EmptyList /> : null}
    </TabLayout>
  );
}
