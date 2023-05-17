import React from 'react';
import Overlay from '../system/Overlay';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCommentInputStore } from '~/hooks/store/useCommentInputStore';

const CommentInputOverlay = () => {
  const visible = useCommentInputStore((state) => state.visible);
  // const toggle = useCommentInputStore((state) => state.toggle);
  console.log(visible);
  return (
    <>
      <Overlay visible={visible} />
      <AnimatePresence initial={false}>
        {visible && (
          <Footer
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{
              damping: 0,
            }}
          />
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
  background: #fff;
`;

export default CommentInputOverlay;
