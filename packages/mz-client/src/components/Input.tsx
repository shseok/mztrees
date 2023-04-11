import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: Props) => {
  // return <StyledInput {...props} />;
  return <StyledInput />;
};
const StyledInput = styled.input`
  height: 48px;
  border-radius: 4px;
  border: 1px solid ${colors.gray2};
  outline: none;
  font-size: 16px;
  padding: 0 16px;
  color: ${colors.gray5};

  &:focus {
    border: 1px solid ${colors.primary};
  }
`;

export default Input;
