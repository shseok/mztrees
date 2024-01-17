import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useItemId } from '../useItemId';
import { editComment } from '@/lib/api/items';
import { useCommentsQuery } from '../query/useCommentsQuery';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useCommentInputStore } from '../stores/useCommentInputStore';
import { shallow } from 'zustand/shallow';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { useDialog } from '@/context/DialogContext';

export function useEditCommentMutation() {
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

  const { mutate: edit, isLoading: isEditLoading } = useMutation(editComment, {
    onSuccess: () => {
      if (!itemId) return;
      // TODO: 추후 변경
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
          edit({
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
  });

  return { edit, isEditLoading };
}
