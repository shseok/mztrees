'use client';

import { useEffect } from 'react';
import styles from '@/styles/StyledTabLayout.module.scss';
import { useSearchParams } from 'next/navigation';
import LinkCardList from '@/components/home/LinkCardList';
import EmptyList from '../system/EmptyList';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';
import Selectors from './Selectors';
import LinkRowList from './LinkRowList';
import { GetItemsResult, SortMode, View } from '@/types/db';
import LoadMore from './LoadMore';

export default function Home({ items }: { items: GetItemsResult }) {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  const { mode, view, setMode, setView, setDateRange } = homeParameterStore(
    (state) => ({
      mode: state.mode,
      view: state.view,
      setMode: state.setMode,
      setView: state.setView,
      setDateRange: state.setDateRange,
    }),
    shallow
  );

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

  // console.log(items);
  // throw new Error();
  const remainingItemCount = items.totalCount - items.list.length;

  return (
    <>
      <div className={styles.content}>
        <Selectors mode={mode} />
        {items.list.length > 0 ? (
          view === 'card' ? (
            <LinkCardList items={items.list} />
          ) : (
            <LinkRowList items={items.list} />
          )
        ) : (
          <EmptyList />
        )}
        {/* TODO: refactor about props drilling (endItemId) */}
        {remainingItemCount > 0 && (
          <LoadMore
            moreItemCount={remainingItemCount}
            endItemId={items.pageInfo.endCursor ?? undefined}
          />
        )}
      </div>
    </>
  );
}
