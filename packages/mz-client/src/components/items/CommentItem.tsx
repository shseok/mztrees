import { useDateDistance } from "@/hooks/useDateDistance";
import { Comment } from "@/types/db";
import SubCommentList from "./SubcommentList";
import LikeButton from "../system/LikeButton";
import { useCommentInputStore } from "@/hooks/stores/useCommentInputStore";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import { useCommentLike } from "@/hooks/useCommentLike";
import { useCommentLikeById } from "@/hooks/stores/useCommentLikesStore";
import { useItemId } from "@/hooks/useItemId";
import { useBottomSheetModalStore } from "@/hooks/stores/useBottomSheetModalStore";
import { useCommentActions } from "@/hooks/useCommentActions";
import styles from "@/styles/CommentItem.module.scss";
import { MoreVert } from "@/components/vectors";
import { useUser } from "@/context/UserContext";
import { cn } from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useMemo, useRef, useState } from "react";
import ReplyComment from "./ReplyComment";
import { isMobile } from "@/lib/isMobile";
import PopperMenu from "../system/PopperMenu";
import ModifyComment from "./ModifyComment";
import { useDialog } from "@/context/DialogContext";

/**@todo isSubcomment 굳이 필요한가에 대한 고민 */
interface Props {
  comment: Comment;
  isSubcomment?: boolean;
}

const CommentItem = ({ comment, isSubcomment }: Props) => {
  const {
    user: { username },
    text,
    createdAt,
    subcomments,
    mentionUser,
    isDeleted,
  } = comment;
  const commentLike = useCommentLikeById(comment.id);
  const { like, unlike } = useCommentLike();
  const dateDistance = useDateDistance(createdAt);
  const { write, edit } = useCommentInputStore();
  const openLoginDialog = useOpenLoginDialog();
  const itemId = useItemId();
  const { currentUser } = useUser();
  const isMyComment = comment.user.id === currentUser?.id;
  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);

  const likes = commentLike?.likes ?? comment.likes;
  const isLiked = commentLike?.isLiked ?? comment.isLiked;
  const { useDeleteComment: deleteComment } = useCommentActions();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const replyRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { mode } = useTheme();
  const { open: openDialog } = useDialog();

  const items = useMemo(
    () => [
      {
        name: "수정",
        onClick: () => {
          // for popperMenu
          if (isMobile()) {
            edit(comment.id, text);
          } else {
            setIsEditing(true);
          }
        },
      },
      {
        name: "삭제",
        onClick: () => {
          openDialog({
            title: "댓글 삭제",
            description: "댓글을 완전히 삭제합니다. 정말 삭제하시겠습니까?",
            mode: "confirm",
            onConfirm: () => {
              deleteComment(comment.id);
              // TODO: Add Spinner & Toast
            },
            confirmText: "삭제",
            cancelText: "취소",
          });
        },
      },
    ],
    [comment.id, text, deleteComment, edit, isMobile(), openDialog]
  );
  const onClickMore = () => {
    if (isMobile()) {
      openBottomSheetModal(items);
    } else {
      setIsMenuVisible(true);
    }
  };

  const toggleLike = async () => {
    if (!itemId) return;
    if (!currentUser) {
      openLoginDialog("commentLike");
      return;
    }
    if (isLiked) {
      unlike({ commentId: comment.id, itemId, prevLikes: likes });
    } else {
      like({ commentId: comment.id, itemId, prevLikes: likes });
    }
  };

  const onReply = async () => {
    if (!currentUser) {
      openLoginDialog("comment");
      return;
    }
    if (isMobile()) {
      write(comment.id);
    }
    setIsReplying(true);
  };

  const onCloseReply = () => {
    setIsReplying(false);
  };

  const onCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const onCloseEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    replyRef.current?.focus();
  }, [isReplying]);

  useEffect(() => {
    editRef.current?.focus();
  }, [isEditing]);

  if (isDeleted) {
    return (
      <div className={styles.block}>
        <p className={cn(styles.deleted_text, mode === "dark" && styles.dark)}>
          삭제된 댓글입니다.
        </p>
        {!isSubcomment && subcomments && (
          <SubCommentList comments={subcomments} />
        )}
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={styles.block}>
        <div className={styles.comment_head}>
          <div className={styles.left_group}>
            <div
              className={cn(styles.user_name, mode === "dark" && styles.dark)}
            >
              {username}
            </div>
            <div className={cn(styles.time, mode === "dark" && styles.dark)}>
              {dateDistance}
            </div>
          </div>
        </div>
        <ModifyComment
          commentId={comment.id}
          initialText={text}
          onClose={onCloseEdit}
          inputRef={editRef}
        />
      </div>
    );
  }

  return (
    <div className={styles.block} data-comment-id={comment.id}>
      <div className={styles.comment_head}>
        <div className={styles.left_group}>
          <div className={cn(styles.user_name, mode === "dark" && styles.dark)}>
            {username}
          </div>
          <div className={cn(styles.time, mode === "dark" && styles.dark)}>
            {dateDistance}
          </div>
        </div>
        {isMyComment && (
          <>
            <button
              className={cn(styles.more_button, mode === "dark" && styles.dark)}
              onClick={onClickMore}
            >
              <MoreVert />
            </button>
            <PopperMenu
              items={items}
              visible={isMenuVisible}
              mode="comment"
              onClose={onCloseMenu}
            />
          </>
        )}
      </div>
      <p className={cn(styles.text, mode === "dark" && styles.dark)}>
        {mentionUser && (
          <span className={styles.mention}>@{mentionUser.username}</span>
        )}
        {text}
      </p>
      <div
        className={cn(styles.comment_footer, mode === "dark" && styles.dark)}
      >
        <div className={styles.like_block}>
          <LikeButton size="small" isLiked={isLiked} onClick={toggleLike} />
          <span className={styles.like_count}>
            {likes === 0 ? "" : likes.toLocaleString()}
          </span>
        </div>
        <button
          className={cn(styles.reply_button, mode === "dark" && styles.dark)}
          onClick={onReply}
        >
          답글 달기
        </button>
      </div>
      {isReplying && (
        <ReplyComment
          parentCommentId={comment.id}
          onClose={onCloseReply}
          inputRef={replyRef}
        />
      )}
      {!isSubcomment && subcomments && (
        <SubCommentList comments={subcomments} />
      )}
    </div>
  );
};
export default CommentItem;
