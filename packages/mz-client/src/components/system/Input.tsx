import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(({ errorMessage, ...rest }: Props, ref) => {
  return (
    <>
      <StyledInput ref={ref} {...rest} />
      {errorMessage ? <Message>{errorMessage}</Message> : null}
    </>
  );
});

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

  &::placeholder {
    color: ${colors.gray2};
  }

  &:disabled {
    background-color: ${colors.gray0};
    color: ${colors.gray3};
  }
`;

const Message = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;

export default Input;
