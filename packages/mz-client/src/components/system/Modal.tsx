import React from 'react';
import Overlay from './Overlay';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  visible: boolean;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({ visible, children, className }: Props) => {
  return (
    <>
      <Overlay visible={visible} />
      <Positioner>
        <AnimatePresence>
          {visible && (
            <Block
              initial={{ y: '30vh', opacity: 0 }}
              animate={{ y: '0vh', opacity: 1 }}
              exit={{ y: '30vh', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={className}
            >
              {children}
            </Block>
          )}
        </AnimatePresence>
      </Positioner>
    </>
  );
};

const Positioner = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Block = styled(motion.div)`
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`;

export default Modal;
