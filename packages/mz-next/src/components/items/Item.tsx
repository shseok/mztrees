"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import { deleteItem } from "@/lib/api/items";
import styles from "@/styles/Item.module.scss";
import ItemViewer from "@/components/items/ItemViewer";
import CommentList from "@/components/items/CommentList";
import CommentInputOverlay from "@/components/items/CommentInputOverlay";
import MoreVertButton from "@/components/base/MoreVertButton";
import { useCommentsQuery } from "@/hooks/query/useCommentsQuery";
import { useUser } from "@/context/userContext";
import { useDialog } from "@/context/DialogContext";
import { useBottomSheetModalStore } from "@/hooks/stores/useBottomSheetModalStore";
import { useRouter } from "next/navigation";
import { Item } from "@/types/db";
import Loading from "@/components/base/PostLoading";

type Props = {
  item: Item;
};

export default function Item({ item }: Props) {
  const { currentUser } = useUser();
  const isMyItem = item ? item.user.id === currentUser?.id : false;
  const { data: comments, status } = useCommentsQuery(item.id);

  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);
  const { open: openDialog } = useDialog();
  const router = useRouter();
  const onClickMore = () => {
    openBottomSheetModal([
      {
        name: "수정",
        onClick: () => {
          // if (!item.id) return;
          router.push(`/write/edit/${item.id}`);
        },
      },
      {
        name: "삭제",
        onClick: () => {
          openDialog({
            title: "삭제",
            description: "정말로 글을 삭제하시겠습니까?",
            mode: "confirm",
            onConfirm: async () => {
              /** TODO: show fullscreen spinner on loading */
              // if (!item.id) return;
              await deleteItem(item.id);
              router.push("/?mode=recent");
              router.refresh();
            },
            confirmText: "삭제",
            cancelText: "취소",
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
      <div className={styles.content}>
        <ItemViewer item={item} />
        {status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          <div>에러</div>
        ) : (
          comments && <CommentList comments={comments} />
        )}
      </div>
      <CommentInputOverlay />
    </BasicLayout>
  );
}
