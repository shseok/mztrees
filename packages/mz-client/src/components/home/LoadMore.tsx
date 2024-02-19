import { useRef } from 'react';
import styles from '@/styles/LoadMore.module.scss';
import { colors } from '@/lib/colors';
import ErrorShower from '@/app/error';
import SkeletonUI from '@/components/system/SkeletonUI';
import LoadingIndicator from '../system/LoadingIndicator';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { useGetNextHomeItemsQuery } from '@/hooks/query/useGetNextHomeItemsQuery';
import { shallow } from 'zustand/shallow';
import LinkCardList from './LinkCardList';
import LinkRowList from './LinkRowList';

export default function LoadMore({ endItemId }: { endItemId?: number }) {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const { reset } = useQueryErrorResetBoundary();
  const { mode, tag, view, dateRange } = homeParameterStore(
    (state) => ({
      mode: state.mode,
      tag: state.tag,
      view: state.view,
      dateRange: state.dateRange,
    }),
    shallow
  );

  const { infiniteData, status, error, fetchNextData, isFetchingNextPage } =
    useGetNextHomeItemsQuery({
      mode,
      tag,
      dateRange,
      initialCursor: endItemId,
    });

  useInfiniteScroll(observerTargetEl, fetchNextData);

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
      {getContent()}
      <div className={styles.loadMore} ref={observerTargetEl}>
        {isFetchingNextPage ? (
          <LoadingIndicator color={colors.primary} />
        ) : null}
      </div>
    </>
  );
}
