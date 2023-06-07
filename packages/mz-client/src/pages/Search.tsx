import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '~/components/base/MobileHeader';
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
import { media } from '~/lib/media';
import DesktopHeader from '~/components/base/DesktopHeader';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') ?? '');
  // const inputResult = useDebounce({ value: searchText, delay: 300 });
  const [inputResult] = useDebounce(searchText, 300);
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    // fetchData();
    navigate(`/search?${stringify({ q: inputResult })}`);
  }, [inputResult, navigate]);
  return (
    <Content>
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
    </Content>
  );
};

const StyledHeader = styled(Header)`
  & > .title {
    width: 100%;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Content = styled.div`
  ${media.tablet} {
    padding-right: 1rem;
    padding-left: 1rem;
    width: 768px;
    margin: 0 auto;
  }
  height: 100%;
`;

export default Search;
