import React, { useEffect, useState } from 'react';
import Overlay from '../system/Overlay';
import { useCommentInputStore } from '@/hooks/stores/useCommentInputStore';
import { shallow } from 'zustand/shallow';
import { useItemId } from '@/hooks/useItemId';
import { useCreateCommentMutation } from '@/hooks/mutation/useCreateCommentMutation';
import LoadingIndicator from '../system/LoadingIndicator';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCommentsQuery } from '@/hooks/query/useCommentsQuery';
import type { Comment } from '@/types/db';
import { produce } from 'immer';
import { useDialog } from '@/context/DialogContext';
import { editComment } from '@/lib/api/items';
import styles from '@/styles/CommentInputOverlay.module.scss';
import { extractNextError } from '@/lib/nextError';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';
const CommentInputOverlay = () => {
  const { visible, close, parentCommentId, commentId, defaultText } =
    useCommentInputStore(
      ({ visible, close, parentCommentId, commentId, defaultText }) => ({
        visible,
        close,
        parentCommentId,
        commentId,
        defaultText,
      }),
      shallow
    );
  // manage text state
  const [text, setText] = useState('');
  const itemId = useItemId();
  const queryClient = useQueryClient();
  const buttonText = commentId ? '수정' : '등록';
  const openLoginDialog = useOpenLoginDialog();

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
  const { open } = useDialog();

  const { mutate: write, isLoading: isWriteLoading } = useCreateCommentMutation(
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
          open({
            title: '오류',
            description: '댓글 작성 실패',
          });
        }
      },
    }
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
        open({
          title: '오류',
          description: '댓글 작성 실패',
        });
      }
    },
  });

  const onClick = () => {
    if (!itemId) return;
    if (text.length === 0) {
      open({
        title: '오류',
        description: '댓글을 입력하지 않으셨습니다.',
      });
      return;
    }
    if (commentId) {
      edit({
        itemId,
        commentId,
        text,
      });
      return;
    }

    write({
      itemId,
      text,
      parentCommentId: parentCommentId ?? undefined,
    });
  };

  useEffect(() => {
    if (visible) {
      setText('');
    }
  }, [visible]);

  const isLoading = isWriteLoading || isEditLoading;
  const defaultTextValue = text || defaultText;
  return (
    <>
      <Overlay visible={visible} onClose={close} />
      <AnimatePresence initial={false}>
        {visible && (
          <LazyMotion features={loadFeature}>
            <MotionDiv
              className={styles.footer}
              initial={{ y: 48 }}
              animate={{ y: 0 }}
              exit={{ y: 48 }}
              transition={{
                damping: 0,
              }}
            >
              <input
                className={styles.input}
                placeholder='댓글을 입력하세요.'
                onChange={(e) => setText(e.target.value)}
                value={defaultTextValue}
                autoFocus
              />
              <button
                className={styles.transparent_button}
                onClick={onClick}
                disabled={isLoading}
                aria-label='테블릿 사이즈보다 작은 화면에서 댓글 작성 버튼'
              >
                {isLoading ? <LoadingIndicator /> : buttonText}
              </button>
            </MotionDiv>
          </LazyMotion>
        )}
      </AnimatePresence>
    </>
  );
};
export default CommentInputOverlay;
