import { useQueryClient } from '@tanstack/react-query';
import { useItemId } from '../useItemId';
import { useCallback } from 'react';
import { deleteComment } from '@/lib/api/items';
import { useCommentsQuery } from '../query/useCommentsQuery';

export function useDeleteCommentMutation() {
  const itemId = useItemId();
  const queryClient = useQueryClient();

  return useCallback(
    async (commentId: number) => {
      if (!itemId) return;
      await deleteComment({ itemId, commentId });
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    [itemId, queryClient]
  );
}
