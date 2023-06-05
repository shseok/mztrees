import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { Size } from '~/lib/api/types';

interface Props {
  onClick: () => void;
  isActive: boolean;
  size: Size;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}

const IconToggleButton = ({ onClick, isActive, size, activeIcon, inactiveIcon }: Props) => {
  return (
    <StyledButton onClick={onClick} size={size}>
      <AnimatePresence initial={false}>
        {isActive ? (
          <SvgWrapper key='fill' initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            {activeIcon}
          </SvgWrapper>
        ) : (
          <SvgWrapper
            key='outline'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {inactiveIcon}
          </SvgWrapper>
        )}
      </AnimatePresence>
    </StyledButton>
  );
};

const StyledButton = styled.button<{ size: Size }>`
  display: flex;
  ${(props) =>
    props.size === 'medium' &&
    css`
      width: 24px;
      height: 24px;
    `}

  ${(props) =>
    props.size === 'small' &&
    css`
      width: 16px;
      height: 16px;
    `}

  svg {
    width: 100%;
    height: 100%;
  }
  position: relative;
`;

const SvgWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

export default IconToggleButton;
