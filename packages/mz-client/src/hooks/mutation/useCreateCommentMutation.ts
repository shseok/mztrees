import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/lib/api/items';
import { useCommentsQuery } from '../query/useCommentsQuery';
import { useItemId } from '../useItemId';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { useCommentInputStore } from '../stores/useCommentInputStore';
import { shallow } from 'zustand/shallow';
import { produce } from 'immer';
import type { Comment } from '@/types/db';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useDialog } from '@/context/DialogContext';

export function useCreateCommentMutation() {
  const itemId = useItemId();
  const queryClient = useQueryClient();
  const openLoginDialog = useOpenLoginDialog();
  const { open: openCommonDialog } = useDialog();
  const { close, parentCommentId } = useCommentInputStore(
    ({ close, parentCommentId }) => ({
      close,
      parentCommentId,
    }),
    shallow
  );

  const scrollToCommentId = (commentId: number) => {
    const commentElement = document.body.querySelector<HTMLDivElement>(
      `[data-comment-id="${commentId}"]`
    );
    if (!commentElement) return;
    commentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    commentElement.focus();
  };

  const { mutate: write, isLoading: isWriteLoading } = useMutation(
    createComment,
    {
      onSuccess: (data) => {
        // TODO: do something with data
        if (!itemId) return;
        const queryKey = useCommentsQuery.extractKey(itemId);
        queryClient.setQueryData(
          queryKey,
          (prevComments: Comment[] | undefined) => {
            if (!prevComments) return;
            if (parentCommentId) {
              // parentCommentId를 가진 comment에다가 data를 추가시켜줘야한다. > 가장 위에서 부터 존재하면 넣어주기
              return produce(prevComments, (draft) => {
                const rootComment =
                  draft.find((comment) => comment.id === parentCommentId) ?? // 첫번째에 발견된 0 level comments
                  draft.find(
                    (comment) =>
                      comment.subcomments?.find(
                        (subcomment) => subcomment.id === parentCommentId
                      )
                  ); // 다음 subcomments에서 발견
                rootComment?.subcomments?.push(data);
              });
            } else {
              return [...prevComments, data];
            }
          }
        );
        // queryClient.invalidateQueries(queryKey);
        setTimeout(() => {
          // 현재 코드 실행 블록이 완료된 다음에 호출되며, 이는 대개 현재의 이벤트 루프 주기가 종료된 후에 발생
          scrollToCommentId(data.id);
        }, 0);
        close();
      },
      onError: async (e, variables) => {
        const error = extractNextError(e);
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            const { itemId, text, parentCommentId } = variables;
            write({
              itemId,
              text,
              parentCommentId: parentCommentId ?? undefined,
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

  return { write, isWriteLoading };
}
