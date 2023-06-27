import { useDateDistance } from "@/hooks/useDateDistance";
import { Comment } from "@/lib/api/types";
import SubCommentList from "./SubcommentList";
import LikeButton from "../system/LikeButton";
import { useCommentInputStore } from "@/hooks/stores/useCommentInputStore";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import { getMyAccount } from "@/lib/api/me";
import { useCommentLike } from "@/hooks/useCommentLike";
import { useCommentLikeById } from "@/hooks/stores/useCommentLikesStore";
import { useItemId } from "@/hooks/useItemId";
import { useBottomSheetModalStore } from "@/hooks/stores/useBottomSheetModalStore";
import { useCommentActions } from "@/hooks/useCommentActions";
import { useUser } from "@/hooks/stores/userStore";
import styles from "@/styles/CommentItem.module.scss";
import { MoreVert } from "@/utils/vectors";

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
  // console.log(subcomments);
  const commentLike = useCommentLikeById(comment.id);
  const { like, unlike } = useCommentLike();
  const distance = useDateDistance(createdAt);
  const { write, edit } = useCommentInputStore();
  const openLoginDialog = useOpenLoginDialog();
  const itemId = useItemId();
  const currentUser = useUser();
  const isMyComment = comment.user.id === currentUser?.id;
  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);

  const likes = commentLike?.likes ?? comment.likes;
  const isLiked = commentLike?.isLiked ?? comment.isLiked;
  const { useDeleteComment: deleteComment } = useCommentActions();
  // const set = setUser();
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
    // const currentUser = await getMyAccount();
    // set(currentUser);
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
    // const currentUser = await getMyAccount();
    // set(currentUser);
    if (!currentUser) {
      openLoginDialog("comment");
      return;
    }

    write(comment.id);
  };
  if (isDeleted) {
    return (
      <div className={styles.block}>
        <p className={styles.deleted_text}>삭제된 댓글입니다.</p>
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
          <div className={styles.user_name}>{username}</div>
          <div className={styles.time}>{distance}</div>
        </div>
        {isMyComment && (
          <button className={styles.more_button} onClick={onClickMore}>
            <MoreVert />
          </button>
        )}
      </div>
      <p className={styles.text}>
        {mentionUser && (
          <span className={styles.mention}>@{mentionUser.username}</span>
        )}
        {text}
      </p>
      <div className={styles.comment_footer}>
        <div className={styles.like_block}>
          <LikeButton size="small" isLiked={isLiked} onClick={toggleLike} />
          <span className={styles.like_count}>
            {likes === 0 ? "" : likes.toLocaleString()}
          </span>
        </div>
        <button className={styles.reply_button} onClick={onReply}>
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
