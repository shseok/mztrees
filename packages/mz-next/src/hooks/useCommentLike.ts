import { likeComment, unlikeComment } from '~/lib/api/items';
import { useCommentLikeSetter } from './stores/useCommentLikesStore';
import { useCallback } from 'react';

export function useCommentLike() {
  // const { mutate: like, isLoading: isLikeLoading } = useMutation(likeComment);
  // const { mutate: unlike, isLoading: isunLikeLoading } = useMutation(unlikeComment);

  // // 방법1. useCOmmentsQuery에서 바로업데이트한다.
  // // 방법2. ItemOverride처럼 CommentLikeMap을 만든다. (택)
  // // - 장점: 배열에서 찾지 않고 queryClient를 업데이트하지 않아서 좋다.

  const set = useCommentLikeSetter();
  const like = useCallback(
    ({ itemId, commentId, prevLikes }: LikeParams) => {
      set(commentId, {
        likes: prevLikes + 1,
        isLiked: true,
      });
      likeComment({ itemId, commentId });
    },
    [set],
  );
  const unlike = useCallback(
    ({ itemId, commentId, prevLikes }: UnlikeParams) => {
      set(commentId, {
        likes: prevLikes - 1,
        isLiked: false,
      });
      unlikeComment({ itemId, commentId });
    },
    [set],
  );

  return { like, unlike };
}

interface LikeParams {
  itemId: number;
  commentId: number;
  prevLikes: number;
}

type UnlikeParams = LikeParams;
