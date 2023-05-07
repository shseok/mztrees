import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as LikeOutline } from '~/assets/like-outline.svg';
import { ReactComponent as LikeFill } from '~/assets/like-fill.svg';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onClick: () => void;
  isLiked: boolean;
}

const LikeButton = ({ onClick, isLiked }: Props) => {
  return (
    <StyledButton>
      <AnimatePresence initial={false}>
        {isLiked ? (
          <SvgWrapper key='fill' initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <StyledLikeFill onClick={onClick} />
          </SvgWrapper>
        ) : (
          <SvgWrapper
            key='outline'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <StyledLikeOutline onClick={onClick} />
          </SvgWrapper>
        )}
      </AnimatePresence>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  padding: 0;
  border: none;
  outline: none;
  background: none;
  width: 24px;
  height: 24px;
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
