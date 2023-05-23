import React from 'react';
import styled from 'styled-components';
import { ReactComponent as MoreVert } from '~/assets/more-vert.svg';
import { colors } from '~/lib/colors';

interface Props {
  onClick: () => void;
}

const MoreVertButton = ({ onClick }: Props) => {
  return (
    <StyledButton onClick={onClick}>
      <MoreVert />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-right: -8px;
  colors: ${colors.gray5};
  svg {
    display: block;
    width: 24px;
    height: 24px;
  }
`;

export default MoreVertButton;
