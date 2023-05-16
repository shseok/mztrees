import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean;
  // 당장은 필요 x
  onClose?: () => void;
}

const Overlay = ({ visible, onClose }: Props) => {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <Fill
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></Fill>
      )}
    </AnimatePresence>
  );
};

const Fill = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  height: -webkit-fill-available;
  // width: 100vh;
  // height: 100vh;
  background: rgba(0, 0, 0, 0.6);
`;

export default Overlay;
