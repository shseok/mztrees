import { useCallback } from 'react';
import { useItemId } from './useItemId';
import { deleteComment } from '~/lib/api/items';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentsQuery } from './query/useCommentsQuery';
import { Comment } from '~/lib/api/types';
import { produce } from 'immer';

export const useDeleteComment = () => {
  const itemId = useItemId();
  const queryClient = useQueryClient();

  return useCallback(
    async (commentId: number) => {
      if (!itemId) return;
      await deleteComment({ itemId, commentId });
      const queryKey = useCommentsQuery.extractKey(itemId);
      queryClient.setQueryData(queryKey, (prevComments: Comment[] | undefined) => {
        if (!prevComments) return;
        // return prevComments.filter((comment: Comment) => comment.id !== commentId);
        return produce(prevComments, (draft) => {
          const seletedComment =
            draft.find((comment) => comment.id === commentId) ??
            draft.find((comment) =>
              comment.subcomments?.find((subcomment) => subcomment.id === commentId),
            );
          if (seletedComment) {
            seletedComment.isDeleted = true;
          }
        });
      });
      // queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    [itemId, queryClient],
  );
};
