import React, { useCallback, useEffect, useRef, useState } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import { getItems } from '~/lib/api/items';
import { GetItemsResult } from '~/lib/api/types';
import { parseUrlParams } from '~/lib/parseUrlParams';
const Home = () => {
  // const [data, setData] = useState<GetItemsResult | null>(null);
  const [pages, setPages] = useState<GetItemsResult[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const fetchNext = useCallback(async () => {
    const { endCursor, hasNextPage } = pages.at(-1)?.pageInfo ?? {
      endCursor: null,
      hasNextPage: false,
    };
    if (!hasNextPage || !endCursor) return;
    const result = await getItems(endCursor);
    setPages((prev) => [...prev, result]);
  }, [pages]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getItems();
      // setData(data);
      setPages([data]);
    };
    console.log('fetching');
    //
    fetchData();
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchNext();
          }
        });
      },
      {
        root: ref.current.parentElement,
        rootMargin: '64px',
        threshold: 1,
      },
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [fetchNext]);

  const items = pages ? pages.flatMap((page) => page.list) : null;
  // console.log('out', items);
  if (!items) {
    return <div>data is not exist</div>;
  }
  return (
    <>
      <LinkCardList items={items} />
      <div ref={ref}>heeeeeeeeeeeeeeeeeellooo</div>
      <div>aaaaaaaaaaaa</div>
    </>
  );
};

export default Home;
