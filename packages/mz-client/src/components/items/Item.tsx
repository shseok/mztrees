'use client';

import BasicLayout from '@/components/layout/BasicLayout';
import { deleteItem } from '@/lib/api/items';
import styles from '@/styles/Item.module.scss';
import ItemViewer from '@/components/items/ItemViewer';
import CommentList from '@/components/items/CommentList';
import MoreVertButton from '@/components/base/MoreVertButton';
import Loading from '@/components/system/PostLoading';
import FloatingActionButtonGroup from '@/components/system/FloatingActionButtonGroup';
import { useCommentsQuery } from '@/hooks/query/useCommentsQuery';
import { useItemQuery } from '@/hooks/query/useItemQuery';
import { useUser } from '@/context/UserContext';
import { useDialog } from '@/context/DialogContext';
import { useBottomSheetModalStore } from '@/hooks/stores/useBottomSheetModalStore';
import { useRouter } from 'next/navigation';
import type { Item } from '@/types/db';
import { isTablet } from '@/lib/isMobile';
import { useMemo } from 'react';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import dynamic from 'next/dynamic';

type Props = {
  item: Item;
};

const CommentInputOverlay = dynamic(() => import('./CommentInputOverlay'), {
  ssr: false,
});

export default function Item({ item }: Props) {
  const { currentUser } = useUser();
  const isMyItem = item ? item.user.id === currentUser?.id : false;
  const { data: comments, status } = useCommentsQuery(item.id);
  const {
    data: { isBookmarked, isLiked, itemStats } = {
      isBookmarked: false,
      isLiked: false,
      itemStats: item.itemStats,
    },
  } = useItemQuery(item.id) || {}; // for like, bookmark update

  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);
  const { open: openDialog } = useDialog();
  const openLoginDialog = useOpenLoginDialog();
  const router = useRouter();
  const items = useMemo(
    // TODO: refactor in hooks
    () => [
      {
        name: '수정',
        onClick: () => {
          // if (!item.id) return;
          router.push(`/write/edit/${item.id}`);
        },
      },
      {
        name: '삭제',
        onClick: () => {
          openDialog({
            title: '글 삭제',
            description: '글을 삭제합니다. 정말로 글을 삭제하시겠습니까?',
            mode: 'confirm',
            onConfirm: async () => {
              /** TODO: show fullscreen spinner on loading */
              // if (!item.id) return;
              try {
                await deleteItem(item.id);
                router.push('/?mode=recent');
                router.refresh();
              } catch (e) {
                const error = extractNextError(e);
                if (
                  error.name === 'Unauthorized' &&
                  error.payload?.isExpiredToken
                ) {
                  try {
                    const tokens = await refreshToken();
                    setClientCookie(`access_token=${tokens.accessToken}`);
                    await deleteItem(item.id);
                  } catch (innerError) {
                    // expire access
                    openLoginDialog('sessionOut');
                    // router.push('login?next=/items/${}?mode=${}')
                  }
                }
                console.log(error);
              }
            },
            confirmText: '삭제',
            cancelText: '취소',
          });
        },
      },
    ],
    [item.id, router, openDialog, openLoginDialog]
  );
  const onClickMore = () => {
    if (isTablet()) {
      openBottomSheetModal(items);
    }
  };

  const updatedItem = { ...item, isBookmarked, isLiked, itemStats };

  return (
    <BasicLayout
      hasBackButton
      title={null}
      headerRight={isMyItem && <MoreVertButton onClickMore={onClickMore} />}
    >
      <div className={styles.content}>
        <ItemViewer item={updatedItem} isMyItem={isMyItem} items={items} />
        {status === 'loading' ? (
          <Loading />
        ) : status === 'error' ? (
          <div>에러</div>
        ) : (
          comments && <CommentList comments={comments} />
        )}
      </div>
      <FloatingActionButtonGroup />
      <CommentInputOverlay />
    </BasicLayout>
  );
}
