import React, { useEffect, useState } from 'react';
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
  console.log(data);
  return <div>Home</div>;
};

export default Home;
