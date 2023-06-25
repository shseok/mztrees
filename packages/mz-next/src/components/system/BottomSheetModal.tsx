import React from 'react';
import Overlay from './Overlay';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomSheetModalItem } from '~/hooks/stores/useBottomSheetModalStore';
import { colors } from '~/lib/colors';

interface Props {
  visible: boolean;
  items: BottomSheetModalItem[];
  onClose: () => void;
}

const BottomSheetModal = ({ visible, items, onClose }: Props) => {
  return (
    <>
      <Overlay visible={visible} onClose={onClose} />
      <AnimatePresence>
        {visible && (
          <Sheet
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ dumping: 0 }}
          >
            <Items onClick={onClose}>
              {items.map((item) => (
                <Item key={item.name} onClick={item.onClick}>
                  {item.name}
                </Item>
              ))}
            </Items>
          </Sheet>
        )}
      </AnimatePresence>
    </>
  );
};

const Sheet = styled(motion.div)`
  position: fixed;
  background: white;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  padding: 16px;
  color: ${colors.gray5};
`;
export default BottomSheetModal;
