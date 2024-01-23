import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useItemId } from '../useItemId';
import { useCallback } from 'react';
import { deleteComment as removeComment } from '@/lib/api/items';
import { useGetCommentsQuery } from '../query/useGetCommentsQuery';
import { produce } from 'immer';
import type { Comment } from '@/types/db';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { useDialog } from '@/context/DialogContext';

export function useDeleteCommentMutation(commentId: number) {
  const itemId = useItemId();
  const queryClient = useQueryClient();
  const openLoginDialog = useOpenLoginDialog();
  const { open: openCommonDialog } = useDialog();

  const { mutate: deleteComment } = useMutation(removeComment, {
    onSuccess: useCallback(() => {
      if (!itemId) return;
      const queryKey = useGetCommentsQuery.extractKey(itemId);
      // comments의 로컬 캐시 데이터 업데이트
      queryClient.setQueryData(
        queryKey,
        (prevComments: Comment[] | undefined) => {
          if (!prevComments) return;
          return produce(prevComments, (draft) => {
            const rootComment = draft.find(
              (comment) => comment.id === commentId
            );
            if (rootComment) {
              rootComment.isDeleted = true;
            } else {
              // childComment
              draft.forEach((comment) => {
                if (!comment.subcomments) return;
                comment.subcomments = comment.subcomments.filter(
                  (subcomment) => {
                    if (subcomment.id === commentId) {
                      subcomment.isDeleted = true;
                    }
                    return subcomment.id !== commentId;
                  }
                );
              });
            }
          });
        }
      );
    }, [itemId, queryClient, commentId]),
    onError: async (e, variables) => {
      const error = extractNextError(e);
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          const { itemId, commentId } = variables;
          setClientCookie(`access_token=${tokens.accessToken}`);
          deleteComment({ itemId, commentId });
        } catch (innerError) {
          // refresh token이 만료되었을 때
          openLoginDialog('sessionOut');
        }
      } else {
        // 서버가 죽지 않는 이상 에러는 발생하지 않을 것
        openCommonDialog({
          title: '오류',
          description: '댓글 삭제 실패',
        });
      }
    },
  });

  return deleteComment;
}
