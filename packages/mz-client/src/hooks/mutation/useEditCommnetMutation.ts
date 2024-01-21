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
import type { MutationProps } from '@/types/custom';
import type { Comment } from '@/types/db';
import { produce } from 'immer';
import { useCallback } from 'react';

export function useEditCommentMutation(resetText: MutationProps) {
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
      onSuccess: useCallback(
        (data: Comment) => {
          if (!itemId) return;
          resetText();
          // 낙관적 업데이트: comments의 로컬 캐시 데이터 업데이트
          const queryKey = useCommentsQuery.extractKey(itemId);
          queryClient.setQueryData(
            queryKey,
            (prevComments: Comment[] | undefined) => {
              if (!prevComments) return;
              return produce(prevComments, (draft) => {
                const rootComment = draft.find(
                  (comment) => comment.id === data.id
                );
                if (rootComment) {
                  rootComment.text = data.text;
                } else {
                  // childComment
                  draft.forEach((comment) => {
                    if (comment.subcomments) {
                      const childComment = comment.subcomments.find(
                        (subcomment) => subcomment.id === data.id
                      );
                      if (childComment) {
                        childComment.text = data.text;
                      }
                    }
                  });
                }
              });
            }
          );
          // queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId)); // 위 내용과 달리 캐시를 지우고 다시 요청
          close();
        },
        [itemId, queryClient]
      ),
      onError: async (e, variables) => {
        const error = extractNextError(e);
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            const { itemId, commentId, text } = variables;
            setClientCookie(`access_token=${tokens.accessToken}`);
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