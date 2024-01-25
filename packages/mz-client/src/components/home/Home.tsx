'use client';

import React, { useEffect, useRef } from 'react';
import styles from '@/styles/StyledTabLayout.module.scss';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { colors } from '@/lib/colors';
import LinkCardList from '@/components/home/LinkCardList';
import SkeletonUI from '@/components/system/SkeletonUI';
import EmptyList from '../system/EmptyList';
import ErrorShower from '@/app/error';
import LoadingIndicator from '../system/LoadingIndicator';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import useGetHomeItemsQuery from '@/hooks/query/useGetHomeItemsQuery';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';
import Selectors from './Selectors';
import LinkRowList from './LinkRowList';
import { SortMode, View } from '@/types/db';

export default function Home() {
  const searchParams = useSearchParams();
  const { reset } = useQueryErrorResetBoundary();
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const observerTargetEl = useRef<HTMLDivElement>(null);

  const { mode, tag, view, dateRange, setMode, setView, setDateRange } =
    homeParameterStore(
      (state) => ({
        mode: state.mode,
        tag: state.tag,
        view: state.view,
        dateRange: state.dateRange,
        setMode: state.setMode,
        setView: state.setView,
        setDateRange: state.setDateRange,
      }),
      shallow
    );
  const { infiniteData, status, error, fetchNextData, isFetchingNextPage } =
    useGetHomeItemsQuery({ mode, tag, dateRange });

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    // link로 접근할 수 있는 mode에 대한 처리
    const nextMode = (searchParams.get('mode') as SortMode) ?? 'trending';
    if (nextMode !== mode) {
      setMode(nextMode);
    }
    // 새로고침시 view에 대한 처리
    const nextView = (searchParams.get('view') as View) ?? 'card';
    if (nextView !== view) {
      setView(nextView);
    }
  }, [searchParams, mode, view]);

  // 변경된 query parameter에 대한 처리
  useEffect(() => {
    if (!startDate || !endDate) return;
    if (mode === 'past') {
      setDateRange([startDate, endDate]);
    }
  }, [startDate, endDate, mode]);

  const items = infiniteData?.pages.flatMap((page) => page.list);

  const getContent = () => {
    if (status === 'loading') {
      return <SkeletonUI />;
    }

    if (status === 'error') {
      // TODO: define error type
      return <ErrorShower error={error as Error} reset={reset} />;
    }

    if (items) {
      return view === 'card' ? (
        <LinkCardList items={items} />
      ) : (
        <LinkRowList items={items} />
      );
    }

    return null;
  };

  return (
    <>
      <div className={styles.content}>
        <Selectors mode={mode} />
        {getContent()}
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
