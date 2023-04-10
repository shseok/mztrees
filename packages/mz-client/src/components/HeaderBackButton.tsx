import React from 'react';
import { ReactComponent as ArrowLeft } from '~/assets/arrow-left.svg';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
}

const HeaderBackButton = ({ onClick }: Props) => {
  return (
    <IconButton onClick={onClick}>
      <ArrowLeft />
    </IconButton>
  );
};

const IconButton = styled.button`
  border: none;
  outline: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-left: -8px;
`;

export default HeaderBackButton;
