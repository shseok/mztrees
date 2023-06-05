import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as LikeOutline } from '~/assets/like-outline.svg';
import { ReactComponent as LikeFill } from '~/assets/like-fill.svg';
import IconToggleButton from './IconToggleButton';
import { Size } from '~/lib/api/types';

interface Props {
  onClick: () => void;
  isLiked: boolean;
  size?: Size;
}

const LikeButton = ({ onClick, isLiked, size = 'medium' }: Props) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isLiked}
      size={size}
      activeIcon={<StyledLikeFill key='fill' />}
      inactiveIcon={<StyledLikeOutline key='outline' />}
    />
  );
};

const StyledLikeOutline = styled(LikeOutline)`
  color: ${colors.gray3};
`;

const StyledLikeFill = styled(LikeFill)`
  color: ${colors.primary};
`;

export default LikeButton;
