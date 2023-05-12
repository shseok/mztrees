import React from 'react';
import { useParams } from 'react-router-dom';
import CommentList from '~/components/items/CommentList';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import useFetch from '~/hooks/useFetch';
import { getItem } from '~/lib/api/items';
import { Item } from '~/lib/api/types';

/** @todos validate itemId */
/** @todos handle 404 */

const Items = () => {
  const { itemId } = useParams();
  const {
    data: item,
    error,
    loading,
  } = useFetch<Item>({
    getDataFunc: getItem,
    id: parseInt(itemId!, 10),
  });
  console.log(item);
  return (
    <BasicLayout hasBackButton title={null}>
      <>
        {loading && <div>로딩중..</div>}
        {/* {error && navigate('/error', { state: { error: error } })} */}
        {error && <div>에러</div>}
        {item && <ItemViewer item={item} />}
        <CommentList />
      </>
    </BasicLayout>
  );
};

export default Items;
