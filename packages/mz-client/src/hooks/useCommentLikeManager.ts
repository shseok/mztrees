import { likeComment, unlikeComment } from "@/lib/api/items";
import { useCommentLikeSetter } from "./stores/useCommentLikesStore";
import { useCallback } from "react";
import { extractNextError } from "@/lib/nextError";
import { refreshToken } from "@/lib/api/auth";
import { setClientCookie } from "@/lib/client";
import { useOpenLoginDialog } from "./useOpenLoginDialog";

export function useCommentLikeManager() {
  // const { mutate: like, isLoading: isLikeLoading } = useMutation(likeComment);
  // const { mutate: unlike, isLoading: isunLikeLoading } = useMutation(unlikeComment);

  // // 방법1. useCommentsQuery에서 바로업데이트한다.
  // // 방법2. ItemOverride처럼 CommentLikeMap을 만든다. (택)
  // // - 장점: 배열에서 찾지 않고 queryClient를 업데이트하지 않아서 좋다.

  const set = useCommentLikeSetter();
  const openLoginDialog = useOpenLoginDialog();

  const like = useCallback(
    async ({ itemId, commentId, prevLikes }: LikeParams) => {
      try {
        set(commentId, {
          likes: prevLikes + 1,
          isLiked: true,
        });
        await likeComment({ itemId, commentId });
      } catch (e) {
        const error = extractNextError(e);
        if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            await likeComment({ itemId, commentId });
          } catch (innerError) {
            set(commentId, {
              likes: prevLikes - 1,
              isLiked: false,
            });
            openLoginDialog("commentLike");
          }
        } else {
          set(commentId, {
            likes: prevLikes - 1,
            isLiked: false,
          });
          openLoginDialog("commentLike");
        }
        // TODO: fail api -> handle error (rollback state)
        console.log(extractNextError(e));
      }
    },
    [set, openLoginDialog]
  );
  const unlike = useCallback(
    async ({ itemId, commentId, prevLikes }: UnlikeParams) => {
      try {
        set(commentId, {
          likes: prevLikes - 1,
          isLiked: false,
        });
        await unlikeComment({ itemId, commentId });
      } catch (e) {
        const error = extractNextError(e);
        if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            await unlikeComment({ itemId, commentId });
          } catch (innerError) {
            set(commentId, {
              likes: prevLikes + 1,
              isLiked: true,
            });
            openLoginDialog("commentLike");
          }
        } else {
          set(commentId, {
            likes: prevLikes + 1,
            isLiked: true,
          });
          openLoginDialog("commentLike");
        }
        // TODO: fail api -> handle error (rollback state)
        console.log(extractNextError(e));
      }
    },
    [set, openLoginDialog]
  );

  return { like, unlike };
}

interface LikeParams {
  itemId: number;
  commentId: number;
  prevLikes: number;
}

type UnlikeParams = LikeParams;
