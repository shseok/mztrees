'use client';

import LinkCardList from '@/components/home/LinkCardList';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useRef } from 'react';
import SkeletonUI from '@/components/system/SkeletonUI';
import styles from '@/styles/StyledTabLayout.module.scss';
import EmptyList from '../system/EmptyList';
import useGetBookmarkItemsQuery from '@/hooks/query/useGetBookmarkItemsQuery';

export default function Bookmark() {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const { status, infiniteData, fetchNextData } = useGetBookmarkItemsQuery();
  useInfiniteScroll(observerTargetEl, fetchNextData);

  const items = infiniteData?.pages
    .flatMap((page) => page.list)
    .map((page) => page.item);

  return (
    <>
      <div className={styles.content} style={{ height: '100%' }}>
        {status === 'loading' ? (
          <SkeletonUI />
        ) : status === 'error' ? (
          <div>페이지를 로딩중입니다. 잠시만 기다려주세요...</div>
        ) : items ? (
          items.length === 0 ? (
            <EmptyList />
          ) : (
            <LinkCardList items={items} />
          )
        ) : null}
        <div ref={observerTargetEl} />
      </div>
    </>
  );
}
