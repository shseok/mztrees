import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LinkCardList from '~/components/home/LinkCardList';
import ListModeSelector from '~/components/home/ListModeSelector';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { getItems } from '~/lib/api/items';
import { GetItemsResult, ListMode } from '~/lib/api/types';
const Home = () => {
  // const [pages, setPages] = useState<GetItemsResult[]>([]);
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState<ListMode>(
    (searchParams.get('mode') as ListMode | null) ?? 'trending',
  );
  const [mode, setMode] = useState<ListMode>(searchText);

  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['Items', mode],
    ({ pageParam = undefined }) => getItems({ mode, cursor: pageParam }),
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

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    const nextUrl = mode === 'trending' ? '/' : `/?mode=${mode}`;
    // render
    setSearchText(mode);
    navigate(nextUrl, { replace: true });
  }, [navigate, mode]);

  console.log(searchText, mode);
  return (
    <>
      {/* render * 2 (init + after) > setMode */}
      <ListModeSelector mode={mode} onSelectMode={setMode} />
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
