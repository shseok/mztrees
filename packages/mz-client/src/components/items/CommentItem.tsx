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
  const distance = useDateDistance(createdAt);
  const { write, edit } = useCommentInputStore();
  const openLoginDialog = useOpenLoginDialog();
  const itemId = useItemId();
  const { currentUser } = useUser();
  const isMyComment = comment.user.id === currentUser?.id;
  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);

  const likes = commentLike?.likes ?? comment.likes;
  const isLiked = commentLike?.isLiked ?? comment.isLiked;
  const { useDeleteComment: deleteComment } = useCommentActions();
  const { mode } = useTheme();

  const onClickMore = () => {
    openBottomSheetModal([
      {
        name: "수정",
        onClick: () => {
          edit(comment.id, text);
        },
      },
      {
        name: "삭제",
        onClick: () => {
          deleteComment(comment.id);
        },
      },
    ]);
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

  // TODO: 댓글을 열고 거기서 댓글 달 경우 처리하기
  const onReply = async () => {
    if (!currentUser) {
      openLoginDialog("comment");
      return;
    }

    write(comment.id);
  };
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

  return (
    <div className={styles.block} data-comment-id={comment.id}>
      <div className={styles.comment_head}>
        <div className={styles.left_group}>
          <div className={cn(styles.user_name, mode === "dark" && styles.dark)}>
            {username}
          </div>
          <div className={cn(styles.time, mode === "dark" && styles.dark)}>
            {distance}
          </div>
        </div>
        {isMyComment && (
          <button
            className={cn(styles.more_button, mode === "dark" && styles.dark)}
            onClick={onClickMore}
          >
            <MoreVert />
          </button>
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
      {!isSubcomment && subcomments && (
        <SubCommentList comments={subcomments} />
      )}
    </div>
  );
};
export default CommentItem;
