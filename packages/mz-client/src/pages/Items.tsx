import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import MoreVertButton from '~/components/base/MoreVertButton';
import CommentInputOverlay from '~/components/items/CommentInputOverlay';
import CommentList from '~/components/items/CommentList';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import { useDialog } from '~/context/DialogContext';
import { useItemAndCommentsQuery } from '~/hooks/query/useCommentsQuery';
import { useBottomSheetModalStore } from '~/hooks/stores/useBottomSheetModalStore';
import { useUser, setUser } from '~/hooks/stores/userStore';
import { getMyAccount } from '~/lib/api/me';
import { deleteItem } from '~/lib/api/items';
import { media } from '~/lib/media';
import { getMyAccountWithRefresh } from '~/lib/protectRoute';

/** @todos validate itemId */
/** @todos handle 404 */

const Items = () => {
  const { itemId } = useParams();
  // const { data, error, loading } = useFetch<Item>({ getDataFunc: () => getItem(parseInt(itemId!, 10)) });
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
  // console.log(result, loading, error);
  const [item, comments] = [result[0].data, result[1].data];

  const navigate = useNavigate();
  const currentUser = useUser();
  // const set = setUser();
  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);
  const { open: openDialog } = useDialog();
  // const fetchData = useCallback(async () => {
  //   const currentUser = await getMyAccount();
  //   set(currentUser);
  // }, []);
  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // TODO: Remove with SSR
  getMyAccountWithRefresh();

  const isMyItem = currentUser?.id === item?.user.id;

  const onClickMore = () => {
    openBottomSheetModal([
      {
        name: '수정',
        onClick: () => {
          if (!itemId) return;
          navigate(`/write/edit?itemId=${itemId}`, { state: { item } });
        },
      },
      {
        name: '삭제',
        onClick: () => {
          openDialog({
            title: '삭제',
            description: '정말로 글을 삭제하시겠습니까?',
            mode: 'confirm',
            onConfirm: async () => {
              /** TODO: show fullscreen spinner on loading */
              if (!itemId) return;
              await deleteItem(parseInt(itemId, 10));
              navigate('/');
            },
            confirmText: '삭제',
            cancelText: '취소',
          });
        },
      },
    ]);
  };

  return (
    <BasicLayout
      hasBackButton
      title={null}
      headerRight={isMyItem && <MoreVertButton onClick={onClickMore} />}
    >
      {loading && <div>로딩중..</div>}
      {/* {error && navigate('/error', { state: { error: error } })} */}
      {error && <div>에러</div>}
      <Content>
        {item && <ItemViewer item={item} />}
        {comments && <CommentList comments={comments} />}
      </Content>
      <CommentInputOverlay />
    </BasicLayout>
  );
};

const Content = styled.div`
  ${media.tablet} {
    padding-right: 1rem;
    padding-left: 1rem;
    width: 768px;
    margin: 0 auto;
    margin-top: 64px;
  }
`;

export default Items;
