import React, { useEffect, useState } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import { getItems } from '~/lib/api/items';
import { GetItemsResult } from '~/lib/api/types';
const Home = () => {
  const [data, setData] = useState<GetItemsResult | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getItems();
      setData(data);
    };
    console.log('fetching');
    //
    fetchData();
  }, []);
  // console.log(data);
  if (!data) {
    return <div>data is not exist</div>;
  }
  return <LinkCardList items={data.list} />;
};

export default Home;
