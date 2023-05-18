import React, { useEffect, useState } from 'react';
import Overlay from '../system/Overlay';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCommentInputStore } from '~/hooks/store/useCommentInputStore';
import { colors } from '~/lib/colors';
import { shallow } from 'zustand/shallow';
import { useItemId } from '~/hooks/useItemId';
import { useCreateCommentMutation } from '~/hooks/mutation/useCreateCommentMutations';
import LoadingIndicator from '../system/LoadingIndicator';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentsQuery } from '~/hooks/query/useCommentsQuery';
import { Comment } from '~/lib/api/types';

const CommentInputOverlay = () => {
  const { visible, close } = useCommentInputStore(
    ({ visible, close }) => ({ visible, close }),
    shallow,
  );
  // manage text state
  const [text, setText] = useState('');
  const itemId = useItemId();
  const queryClient = useQueryClient();

  const scrollToCommentId = (commentId: number) => {
    const commentElement = document.body.querySelector<HTMLDivElement>(
      `[data-comment-id="${commentId}"]`,
    );
    if (!commentElement) return;
    commentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    commentElement.focus();
  };

  const { mutate, isLoading } = useCreateCommentMutation({
    onSuccess: (data) => {
      // TODO: do something with data
      if (!itemId) return;
      const queryKey = useCommentsQuery.extractKey(itemId);
      queryClient.setQueryData(queryKey, (prevComments: Comment[] | undefined) =>
        prevComments ? [...prevComments, data] : [data],
      );
      // queryClient.invalidateQueries(queryKey);
      setTimeout(() => {
        // 현재 코드 실행 블록이 완료된 다음에 호출되며, 이는 대개 현재의 이벤트 루프 주기가 종료된 후에 발생
        scrollToCommentId(data.id);
      }, 50);
      close();
    },
  });

  const onClick = () => {
    if (!itemId) return;
    mutate({
      itemId,
      text,
    });
  };

  useEffect(() => {
    if (visible) {
      setText('');
    }
  }, [visible]);

  return (
    <>
      <Overlay visible={visible} onClose={onClick} />
      <AnimatePresence initial={false}>
        {visible && (
          <Footer
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{
              damping: 0,
            }}
          >
            <Input
              placeholder='댓글을 입력하세요.'
              onChange={(e) => setText(e.target.value)}
              value={text}
              autoFocus
            />
            <TransparentButton onClick={onClick} disabled={isLoading}>
              {isLoading ? <LoadingIndicator /> : '등록'}
            </TransparentButton>
          </Footer>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = styled(motion.div)`
  position fixed;
  bottom: 0;
  height: 48px;
  width: 100%;
  background: white;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  padding: 0;
  padding-left: 16px;
  font-size: 16px;
  color: ${colors.gray5};
  &::placeholder {
    color: ${colors.gray1};
  }
`;

const TransparentButton = styled.button`
  width: 60px;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  color: ${colors.primary};
  font-size: 16px;
  font-weight: 600;
  padding-left: 16px;
  padding-right: 16px;
`;
export default CommentInputOverlay;
