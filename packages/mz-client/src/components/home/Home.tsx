'use client';

import type { SortMode } from '@/types/db';
import React, { useEffect, useRef } from 'react';
import styles from '@/styles/StyledTabLayout.module.scss';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useSearchParams } from 'next/navigation';
import { colors } from '@/lib/colors';
import LinkCardList from '@/components/home/LinkCardList';
import SortModeSelector from '@/components/home/SortModeSelector';
import WeekSelector from '@/components/home/WeekSelector';
import SkeletonUI from '@/components/system/SkeletonUI';
import EmptyList from '../system/EmptyList';
import ErrorShower from '@/app/error';
import LoadingIndicator from '../system/LoadingIndicator';
import useGetHomeItemsQuery from '@/hooks/query/useGetHomeItemsQuery';
import TagSelector from './TagSelector';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';

export default function Home() {
  const searchParams = useSearchParams();
  const { reset } = useQueryErrorResetBoundary();
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const observerTargetEl = useRef<HTMLDivElement>(null);

  const { mode, tag, dateRange, setMode, setDateRange } = homeParameterStore(
    (state) => ({
      mode: state.mode,
      tag: state.tag,
      view: state.view,
      dateRange: state.dateRange,
      setMode: state.setMode,
      setDateRange: state.setDateRange,
    }),
    shallow
  );
  const { infiniteData, status, error, fetchNextData, isFetchingNextPage } =
    useGetHomeItemsQuery({ mode, tag, dateRange });

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    const nextMode = (searchParams.get('mode') as SortMode) ?? 'trending';
    if (nextMode !== mode) {
      setMode(nextMode);
    }
  }, [searchParams, mode]);

  useEffect(() => {
    if (!startDate || !endDate) return;
    if (mode === 'past') {
      setDateRange([startDate, endDate]);
    }
  }, [startDate, endDate, mode]);

  const items = infiniteData?.pages.flatMap((page) => page.list);

  return (
    <>
      <div className={styles.content}>
        <SortModeSelector />
        <TagSelector />
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
    </>
  );
}
