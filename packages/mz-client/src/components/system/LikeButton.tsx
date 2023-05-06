import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as LikeOutline } from '~/assets/like-outline.svg';
import { ReactComponent as LikeFill } from '~/assets/like-fill.svg';

interface Props {
  onClick: () => void;
  isLiked: boolean;
}

const LikeButton = ({ onClick, isLiked }: Props) => {
  return (
    <StyledButton>
      {isLiked ? <StyledLikeFill onClick={onClick} /> : <StyledLikeOutline onClick={onClick} />}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  padding: 0;
  border: none;
  outline: none;
  background: none;
`;

const StyledLikeOutline = styled(LikeOutline)`
  color: ${colors.gray3};
`;

const StyledLikeFill = styled(LikeFill)`
  color: ${colors.primary};
`;

export default LikeButton;
