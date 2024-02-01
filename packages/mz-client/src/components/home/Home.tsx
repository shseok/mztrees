'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/StyledTabLayout.module.scss';
import { useSearchParams } from 'next/navigation';
import LinkCardList from '@/components/home/LinkCardList';
import EmptyList from '../system/EmptyList';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { useGetFirstHomeItemsQuery } from '@/hooks/query/useGetHomeItemsQuery';
import { shallow } from 'zustand/shallow';
import Selectors from './Selectors';
import LinkRowList from './LinkRowList';
import { SortMode, View } from '@/types/db';
import LoadMore from './LoadMore';
import Button from '../system/Button';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import SkeletonUI from '../system/SkeletonUI';
import ErrorShower from '@/app/error';

export default function Home() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const [isMore, setIsMore] = useState(false);
  const { reset } = useQueryErrorResetBoundary();

  const { mode, view, tag, dateRange, setMode, setView, setDateRange } =
    homeParameterStore(
      (state) => ({
        mode: state.mode,
        view: state.view,
        tag: state.tag,
        dateRange: state.dateRange,
        setMode: state.setMode,
        setView: state.setView,
        setDateRange: state.setDateRange,
      }),
      shallow
    );
  const { status, currentItems, error } = useGetFirstHomeItemsQuery({
    mode,
    tag,
    dateRange,
  });
  const handleToggle = () => {
    setIsMore((prev) => !prev);
  };

  const getContent = () => {
    if (status === 'loading') {
      return <SkeletonUI />;
    }

    if (status === 'error') {
      return <ErrorShower error={error as Error} reset={reset} />;
    }

    if (currentItems) {
      const { list } = currentItems;
      return list.length > 0 ? (
        view === 'card' ? (
          <LinkCardList items={list} />
        ) : (
          <LinkRowList items={list} />
        )
      ) : (
        <EmptyList />
      );
    }

    return null;
  };

  useEffect(() => {
    const nextMode = (searchParams.get('mode') as SortMode) ?? 'trending';
    if (nextMode !== mode) {
      setMode(nextMode);
    }
    const nextView = (searchParams.get('view') as View) ?? 'card';
    if (nextView !== view) {
      setView(nextView);
    }
  }, [searchParams, mode, view]);

  useEffect(() => {
    if (!startDate || !endDate) return;
    if (mode === 'past') {
      setDateRange([startDate, endDate]);
    }
  }, [startDate, endDate, mode]);

  // throw new Error();
  const { list, totalCount, pageInfo } = currentItems ?? {
    list: [],
    totalCount: 0,
    pageInfo: { hasNextPage: false, endCursor: null },
  };
  const remainingItemCount = totalCount - list.length;
  return (
    <div className={styles.content}>
      <Selectors mode={mode} />
      {/* First item list section */}
      {getContent()}
      {/* Load more item list section */}
      {remainingItemCount > 0 && (
        <>
          {!isMore && (
            <section className={styles.button_wrapper}>
              <Button
                type='button'
                aria-label='방문하기'
                variant='visit'
                onClick={handleToggle}
              >
                <span>{`더 많은 글 보기 +${remainingItemCount}`}</span>
              </Button>
            </section>
          )}
          {isMore && <LoadMore endItemId={pageInfo.endCursor ?? undefined} />}
        </>
      )}
    </div>
  );
}
