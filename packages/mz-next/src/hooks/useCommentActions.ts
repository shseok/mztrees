import { useCallback } from 'react';
import { useItemId } from './useItemId';
import { deleteComment, editComment } from '~/lib/api/items';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentsQuery } from './query/useCommentsQuery';
import { Comment } from '~/lib/api/types';
import { produce } from 'immer';

// TODO: mutation으로 변경 후 폴더로 이동하기
export const useCommentActions = () => {
  const itemId = useItemId();
  const queryClient = useQueryClient();
  // like와 마찬가지로 mutation x > commentItem에서 쓰이고 있음
  const useDeleteComment = useCallback(
    async (commentId: number) => {
      if (!itemId) return;
      await deleteComment({ itemId, commentId });
      const queryKey = useCommentsQuery.extractKey(itemId);
      queryClient.setQueryData(queryKey, (prevComments: Comment[] | undefined) => {
        if (!prevComments) return;
        // return prevComments.filter((comment: Comment) => comment.id !== commentId);
        return produce(prevComments, (draft) => {
          const rootComment = draft.find((comment) => comment.id === commentId);
          if (rootComment) {
            rootComment.isDeleted = true;
          }
          // childComment
          draft.forEach((comment) => {
            if (comment.subcomments) {
              comment.subcomments = comment.subcomments.filter(
                (subcomment) => subcomment.id !== commentId,
              );
            }
          });
        });
      });
      // queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    [itemId, queryClient],
  );
  // TODO: commentInputOverlay에서 mutation으로 쓰고 있으므로 추후 변경 후 대체하기
  const useEditComment = useCallback(
    async (commentId: number, text: string) => {
      if (!itemId) return;
      await editComment({ itemId, commentId, text });
      const queryKey = useCommentsQuery.extractKey(itemId);
      queryClient.setQueryData(queryKey, (prevComments: Comment[] | undefined) => {
        if (!prevComments) return;
        // return prevComments.filter((comment: Comment) => comment.id !== commentId);
        return produce(prevComments, (draft) => {
          const rootComment = draft.find((comment) => comment.id === commentId);
          if (rootComment) {
            rootComment.text = text;
          }
          // childComment
          draft.forEach((comment) => {
            if (comment.subcomments) {
              const childComment = comment.subcomments.find(
                (subcomment) => subcomment.id === commentId,
              );
              if (childComment) {
                childComment.text = text;
              }
            }
          });
        });
      });
      // queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    [itemId, queryClient],
  );
  return { useDeleteComment, useEditComment };
};
