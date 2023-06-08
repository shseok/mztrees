import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from '~/hooks/useOnClickOuteside';
import { colors } from '~/lib/colors';
import { mediaQuery } from '~/lib/media';

interface Props {
  visible: boolean;
  onClose: (e?: Event) => void;
}

const UserMenu = ({ visible, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <Block
          onClick={() => {
            onClose();
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          ref={ref}
        >
          <Triangle />
          <TriangleBorder />
          <MenuItem isMobileHidden={true} onClick={() => navigate('/write')}>
            새 글 등록
          </MenuItem>
          <MenuItem onClick={() => navigate('/setting')}>내 계정</MenuItem>
          <MenuItem onClick={() => navigate('/bookmarks')}>북마크</MenuItem>
          <MenuItem onClick={() => navigate('/login')}>로그아웃</MenuItem>
        </Block>
      )}
    </AnimatePresence>
  );
};

const Block = styled(motion.div)`
  background: white;
  position: absolute;
  top: 48px;
  right: 0;
  width: 200px;
  border-radius: 4px;
  // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
  z-index: 1;
`;

const MenuItem = styled.div<{ isMobileHidden?: boolean }>`
  ${(props) =>
    props.isMobileHidden &&
    css`
      display: none;
      ${mediaQuery(700)} {
        display: block;
      }
    `}
  color: ${colors.gray5};
  padding: 16px;
  cursor: pointer;

  &:hover {
    transition: all 0.125s ease-in;
    background: ${colors.gray0};
  }
`;

const Triangle = styled.div`
  position: absolute;
  top: -8px;
  right: 16px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  z-index: 2;
`;

const TriangleBorder = styled.div`
  position: absolute;
  top: -10px;
  right: 14px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #e0e0e0;
  z-index: 1;
`;

export default UserMenu;
