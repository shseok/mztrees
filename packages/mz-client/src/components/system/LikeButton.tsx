import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as LikeOutline } from '~/assets/like-outline.svg';
import { ReactComponent as LikeFill } from '~/assets/like-fill.svg';
import { motion, AnimatePresence } from 'framer-motion';

type Size = 'small' | 'medium' | 'large';

interface Props {
  onClick: () => void;
  isLiked: boolean;
  size?: Size;
}

const LikeButton = ({ onClick, isLiked, size = 'medium' }: Props) => {
  return (
    <StyledButton onClick={onClick} size={size}>
      <AnimatePresence initial={false}>
        {isLiked ? (
          <SvgWrapper key='fill' initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <StyledLikeFill />
          </SvgWrapper>
        ) : (
          <SvgWrapper
            key='outline'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <StyledLikeOutline />
          </SvgWrapper>
        )}
      </AnimatePresence>
    </StyledButton>
  );
};

const StyledButton = styled.button<{ size: Size }>`
  padding: 0;
  border: none;
  outline: none;
  background: none;
  display: inline-flex;
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

const StyledLikeOutline = styled(LikeOutline)`
  color: ${colors.gray3};
`;

const StyledLikeFill = styled(LikeFill)`
  color: ${colors.primary};
`;

export default LikeButton;
