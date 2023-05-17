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

const CommentInputOverlay = () => {
  const { visible, close, parentCommentId } = useCommentInputStore(
    ({ visible, close, parentCommentId }) => ({ visible, close, parentCommentId }),
    shallow,
  );
  // manage text state
  const [text, setText] = useState('');
  const itemId = useItemId();

  const { mutate, isLoading } = useCreateCommentMutation({
    onSuccess: () => {
      // TODO: do something with data

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
