import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MobileHeader from '~/components/base/MobileHeader';
import TabLayout from '~/components/layout/TabLayout';
import SearchInput from '~/components/search/SearchInput';
// import useDebounce from '~/hooks/useDebounce';
import { useDebounce } from 'use-debounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stringify } from 'qs';
import { searchItems } from '~/lib/api/search';
import SearchResultCardList from '~/components/search/SearchResultCardList';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import DesktopHeader from '~/components/base/DesktopHeader';
import { getMyAccountWithRefresh } from '~/lib/protectRoute';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') ?? '');
  // const inputResult = useDebounce({ value: searchText, delay: 300 });
  const [inputResult] = useDebounce(searchText, 300);
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  console.log(searchParams.get('q'), searchText);
  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['searchItems', inputResult],
    ({ pageParam = undefined }) => searchItems({ q: inputResult, offset: pageParam }),
    {
      enabled: inputResult.trim() !== '',
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.nextOffset;
      },
    },
  );
  // console.log(inputResult, searchText, searchParams.get('q'));
  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  // TODO: resolve desktop render about search with SSR
  useEffect(() => {
    setSearchText(searchParams.get('q') ?? '');
  }, [searchParams.get('q')]);

  useEffect(() => {
    navigate(`/search?${stringify({ q: inputResult })}`);
  }, [inputResult, navigate]);

  // TODO: Remove with SSR
  getMyAccountWithRefresh();

  return (
    <TabLayout
      header={
        <>
          <StyledHeader title={<SearchInput value={searchText} onChangeText={setSearchText} />} />
          <DesktopHeader />
        </>
      }
    >
      {inputResult.trim() !== '' &&
        (status === 'loading' ? (
          <div>Loading...</div>
        ) : status === 'error' ? (
          // // TODO: define error type
          <div>Error: {(error as any).message}</div>
        ) : (
          <>
            <SearchResultCardList items={infiniteData.pages.flatMap((page) => page.list) ?? []} />
            <div ref={observerTargetEl} />
          </>
        ))}
      <ReactQueryDevtools position='top-right' />
    </TabLayout>
  );
};

const StyledHeader = styled(MobileHeader)`
  & > .title {
    width: 100%;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export default Search;
