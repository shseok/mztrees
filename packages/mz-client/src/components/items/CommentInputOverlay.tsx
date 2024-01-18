import React, { useState } from 'react';
import Overlay from '../system/Overlay';
import { shallow } from 'zustand/shallow';
import { useCommentInputStore } from '@/hooks/stores/useCommentInputStore';
import { useEditCommentMutation } from '@/hooks/mutation/useEditCommnetMutation';
import { useCreateCommentMutation } from '@/hooks/mutation/useCreateCommentMutation';
import { useItemId } from '@/hooks/useItemId';
import LoadingIndicator from '../system/LoadingIndicator';
import { useDialog } from '@/context/DialogContext';
import styles from '@/styles/CommentInputOverlay.module.scss';
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
  const buttonText = commentId ? '수정' : '등록';
  const resetText = () => setText('');
  const { open: openDialog } = useDialog();
  const { writeComment, isWriteLoading } = useCreateCommentMutation(
    resetText,
    parentCommentId
  );
  const { editComment, isEditLoading } = useEditCommentMutation(resetText);

  const onClick = () => {
    if (!itemId) return;
    if (text.length === 0) {
      openDialog({
        title: '오류',
        description: '댓글을 입력하지 않으셨습니다.',
      });
      return;
    }
    if (commentId) {
      editComment({
        itemId,
        commentId,
        text,
      });
      return;
    }

    writeComment({
      itemId,
      text,
      parentCommentId: parentCommentId ?? undefined,
    });
  };
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
              role='dialog'
              aria-label='댓글 작성 영역'
            >
              <input
                className={styles.input}
                placeholder='댓글을 입력하세요.'
                onChange={(e) => setText(e.target.value)}
                value={defaultTextValue}
                autoFocus
              />
              <button
                type='button'
                aria-label='테블릿 사이즈보다 작은 화면에서 댓글 작성 버튼'
                className={styles.transparent_button}
                onClick={onClick}
                disabled={isLoading}
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
