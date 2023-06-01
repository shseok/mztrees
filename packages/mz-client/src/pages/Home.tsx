import React, { useCallback, useRef, useState } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import ListModeSelector from '~/components/home/ListModeSelector';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { getItems } from '~/lib/api/items';
import { GetItemsResult, ListMode } from '~/lib/api/types';
const Home = () => {
  const [pages, setPages] = useState<GetItemsResult[]>([]);
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ListMode>('trending');
  const fetchNext = useCallback(async () => {
    const { endCursor, hasNextPage } = pages.at(-1)?.pageInfo ?? {
      endCursor: undefined,
      hasNextPage: false,
    };
    // 다음에 가져올 것이 없음 -> hasNextPage로 사용하는게 맞지만 초기값때문에 애매
    if (endCursor === null) return;
    console.log('fetchNext');
    const result = await getItems({ mode: 'recent', cursor: endCursor });
    setPages((prev) => [...prev, result]);
  }, [pages]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getItems();
  //     // setData(data);
  //     setPages([data]);
  //   };
  //   console.log('fetching');
  //   //
  //   fetchData();
  // }, []);
  useInfiniteScroll(observerTargetEl, fetchNext);

  const items = pages ? pages.flatMap((page) => page.list) : null;
  // console.log('out', items);
  if (!items) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ListModeSelector mode={mode} onSelectMode={setMode} />
      <LinkCardList items={items} />
      <div ref={observerTargetEl} />
    </>
  );
};

export default Home;
