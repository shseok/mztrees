import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { colors } from '~/lib/colors';

interface ButtonProps {
  layoutMode: 'inline' | 'fullWidth';
}
interface Props extends React.HTMLAttributes<HTMLButtonElement>, ButtonProps {}

const Button = forwardRef<HTMLButtonElement, Props>(({ layoutMode, ...rest }: Props, ref) => {
  return <StyledButton ref={ref as any} layoutMode={layoutMode} {...rest} />;
});

const StyledButton = styled.button<ButtonProps>`
  background: ${colors.primary};
  height: 48px;
  //color: ${colors.gray0};
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  padding: 0 16px;

  ${(props) =>
    props.layoutMode === 'fullWidth' &&
    css`
      width: 100%;
    `}
`;

export default Button;
