import React from 'react';
import { Size } from '~/lib/api/types';
import IconToggleButton from './IconToggleButton';
import { ReactComponent as BookmarkOutline } from '~/assets/bookmark-outline.svg';
import { ReactComponent as BookmarkFill } from '~/assets/bookmark-fill.svg';
import { colors } from '~/lib/colors';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
  isLiked: boolean;
  size?: Size;
}

const BookmarkButton = ({ onClick, isLiked, size = 'medium' }: Props) => {
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

const StyledLikeOutline = styled(BookmarkOutline)`
  color: ${colors.gray3};
`;

const StyledLikeFill = styled(BookmarkFill)`
  color: ${colors.primary};
`;

export default BookmarkButton;
