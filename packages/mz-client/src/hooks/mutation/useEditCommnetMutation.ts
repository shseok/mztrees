import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useItemId } from '../useItemId';
import { editComment as modifyComment } from '@/lib/api/items';
import { useCommentsQuery } from '../query/useCommentsQuery';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useCommentInputStore } from '../stores/useCommentInputStore';
import { shallow } from 'zustand/shallow';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { useDialog } from '@/context/DialogContext';
import type { CommentMutationProps } from '@/types/custom';

export function useEditCommentMutation(resetText: CommentMutationProps) {
  const itemId = useItemId();
  const queryClient = useQueryClient();
  const openLoginDialog = useOpenLoginDialog();
  const { open: openCommonDialog } = useDialog();
  const { close } = useCommentInputStore(
    ({ close }) => ({
      close,
    }),
    shallow
  );

  const { mutate: editComment, isLoading: isEditLoading } = useMutation(
    modifyComment,
    {
      onSuccess: () => {
        if (!itemId) return;
        resetText();
        // TODO: useCreateCommentMutation처럼 낙관적 업데이트 적용
        queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
        close();
      },
      onError: async (e, variables) => {
        const error = extractNextError(e);
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            const { itemId, commentId, text } = variables;
            editComment({
              itemId,
              commentId,
              text,
            });
          } catch (innerError) {
            // expire refresh
            openLoginDialog('sessionOut');
          }
        } else {
          // 서버가 죽지 않는 이상 에러는 발생하지 않을 것
          openCommonDialog({
            title: '오류',
            description: '댓글 작성 실패',
          });
        }
      },
    }
  );

  return { editComment, isEditLoading };
}
