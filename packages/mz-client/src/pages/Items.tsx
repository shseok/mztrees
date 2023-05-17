import { useParams } from 'react-router-dom';
import CommentInputOverlay from '~/components/items/CommentInputOverlay';
import CommentList from '~/components/items/CommentList';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import { useItemAndCommentsQuery } from '~/hooks/query/useCommentsQuery';

/** @todos validate itemId */
/** @todos handle 404 */

const Items = () => {
  const { itemId } = useParams();
  // const {
  //   data: item,
  //   error,
  //   loading,
  // } = useFetch<Item>({
  //   getDataFunc: getItem,
  //   id: parseInt(itemId!, 10),
  // });
  // const [data, setData] = useState<Item | null>(null);
  // const [comments, setComments] = useState<Comment[] | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  const itemIntId = parseInt(itemId!, 10);
  // const fetchData = useCallback(async (): Promise<void> => {
  //   try {
  //     const [res, comments] = await Promise.all([getItem(itemIntId), getComments(itemIntId)]);
  //     setData(res);
  //     setComments(comments);
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       setError(err.message);
  //     } else {
  //       setError('Unknown error occurred');
  //     }

  //     setLoading(false); // 중복?
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [itemId, getItem, getComments]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const result = useItemAndCommentsQuery(itemIntId);
  const loading = result.some((result) => result.isLoading);
  const error = result.some((result) => result.isError);
  console.log(result, loading, error);
  const [item, comments] = [result[0].data, result[1].data];
  return (
    <BasicLayout hasBackButton title={null}>
      {loading && <div>로딩중..</div>}
      {/* {error && navigate('/error', { state: { error: error } })} */}
      {error && <div>에러</div>}
      {item && <ItemViewer item={item} />}
      {comments && <CommentList comments={comments} />}
      <CommentInputOverlay />
    </BasicLayout>
  );
};

export default Items;
