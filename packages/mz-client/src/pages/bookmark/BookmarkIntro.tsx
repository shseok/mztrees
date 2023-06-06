import { useInfiniteQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import LinkCardList from '~/components/home/LinkCardList';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { getBookmarks } from '~/lib/api/bookmark';
import { media } from '~/lib/media';

const BookmarkIntro = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { status, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['bookmarks'],
    ({ pageParam = undefined }) => getBookmarks(pageParam),
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

  useInfiniteScroll(ref, fetchNextData);

  if (status === 'loading') return <div>'로딩중...'</div>;
  if (status === 'error') return <div>'에러'</div>;

  return (
    <Content>
      <LinkCardList items={data.pages.flatMap((page) => page.list).map((page) => page.item)} />
      <div ref={ref} />
      <ReactQueryDevtools position='top-right' />
    </Content>
  );
};

const Content = styled.div`
  ${media.widescreen} {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export default BookmarkIntro;
