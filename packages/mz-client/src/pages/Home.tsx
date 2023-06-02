import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LinkCardList from '~/components/home/LinkCardList';
import ListModeSelector from '~/components/home/ListModeSelector';
import WeekSelector from '~/components/home/WeekSelector';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { getItems } from '~/lib/api/items';
import { ListMode } from '~/lib/api/types';
import { getWeekRangeFromDate } from '~/lib/week';
const Home = () => {
  // const [pages, setPages] = useState<GetItemsResult[]>([]);
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState<ListMode>(
    (searchParams.get('mode') as ListMode | null) ?? 'trending',
  );
  const [mode, setMode] = useState<ListMode>(searchText);

  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
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
    ['Items', mode],
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

  useEffect(() => {
    const nextUrl =
      mode === 'trending'
        ? '/'
        : mode === 'past'
        ? `/?mode=${mode}&startDate=${dateRange[0]}&endDate=${dateRange[1]}`
        : `/?mode=${mode}`;
    // render
    setSearchText(mode);
    navigate(nextUrl, { replace: true });
  }, [navigate, mode]);

  useEffect(() => {
    if (mode === 'past') {
      setDateRange(startDate && endDate ? [startDate, endDate] : defaultDateRange);
    }
  }, [startDate, endDate, defaultDateRange, mode]);

  console.log(searchText, mode);
  return (
    <>
      {/* render * 2 (init + after) > setMode */}
      <ListModeSelector mode={mode} onSelectMode={setMode} />
      {mode === 'past' && <WeekSelector dateRange={dateRange} />}
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : status === 'error' ? (
        // TODO: define error type
        <div>Error: {(error as any).message}</div>
      ) : (
        <>
          <LinkCardList items={infiniteData.pages.flatMap((page) => page.list)} />
          <div ref={observerTargetEl} />
        </>
      )}
    </>
  );
};

export default Home;
