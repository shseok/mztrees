import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import LinkCardList from '~/components/home/LinkCardList';
import ListModeSelector from '~/components/home/ListModeSelector';
import WeekSelector from '~/components/home/WeekSelector';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { getItems } from '~/lib/api/items';
import { ListMode } from '~/lib/api/types';
import { media } from '~/lib/media';
import { getWeekRangeFromDate } from '~/lib/week';

const Home = () => {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get('mode') as ListMode | null) ?? 'trending',
  );

  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const [dateRange, setDateRange] = useState(
    startDate && endDate ? [startDate, endDate] : defaultDateRange,
  );

  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['Items', mode, mode === 'past' ? dateRange : undefined].filter((item) => !!item),
    ({ pageParam = undefined }) =>
      getItems({
        mode,
        cursor: pageParam,
        ...(mode === 'past' ? { startDate: dateRange[0], endDate: dateRange[1] } : {}),
      }),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.endCursor;
      },
    },
  );

  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage]);

  // const { ref, inView, entry } = useInView();
  useInfiniteScroll(observerTargetEl, fetchNextData);

  const onselect = (mode: ListMode) => {
    setSearchParams({ mode });
  };

  useEffect(() => {
    const nextMode = (searchParams.get('mode') as ListMode) ?? 'trending';
    if (nextMode !== mode) {
      setMode(nextMode);
    }
  }, [searchParams, mode]);

  useEffect(() => {
    if (mode === 'past') {
      setDateRange(startDate && endDate ? [startDate, endDate] : defaultDateRange);
    }
  }, [startDate, endDate, defaultDateRange, mode]);

  // if (typeof window !== 'undefined') {
  //   (window as any).queryClient = useQueryClient();
  // }

  // useIsMultiColumnCheck();

  return (
    <>
      {/* render * 2 (init + after) > setMode */}
      <ListModeSelector mode={mode} onSelectMode={onselect} />
      {mode === 'past' && <WeekSelector dateRange={dateRange} />}
      {/* TODO: make loading */}
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : status === 'error' ? (
        // TODO: define error type
        <div>Error: {(error as any).message}</div>
      ) : (
        <Content>
          <LinkCardList items={infiniteData.pages.flatMap((page) => page.list)} />
          <div ref={observerTargetEl} />
        </Content>
      )}
      <ReactQueryDevtools position='top-right' />
    </>
  );
};

const Content = styled.div`
  ${media.widescreen} {
    width: 1150px;
    margin: 0 auto;
  }
`;
export default Home;
