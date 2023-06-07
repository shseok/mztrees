import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { colors } from '~/lib/colors';
import { hover } from '~/lib/styles';

interface ButtonProps {
  layoutMode?: 'inline' | 'fullWidth';
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium';
}
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ layoutMode = 'inline', variant = 'primary', size = 'medium', ...rest }: Props, ref) => {
    return (
      <StyledButton
        ref={ref as any}
        layoutMode={layoutMode}
        variant={variant}
        size={size}
        {...rest}
      />
    );
  },
);

// TODO: 나머지 hover 처리해주기
const variantStyled = {
  primary: css`
    color: white;
    background: ${colors.primary};
    ${hover(
      css`
        opacity: 0.8;
      `,
    )}
  `,
  secondary: css`
    color: ${colors.primary};
    background: ${colors.secondary};
    ${hover(
      css`
        opacity: 0.8;
      `,
    )}
  `,
  tertiary: css`
    background: transparent;
    color: ${colors.gray4};
    ${hover(`background: ${colors.gray0};`)}
  `,
};

const sizeStyled = {
  small: css`
    height: 36px;
    font-size: 14px;
    padding: 0 12px;
  `,
  medium: css`
    height: 48px;
    font-size: 16px;
    padding: 0 16px;
  `,
};

const StyledButton = styled.button<ButtonProps>`
  ${(props) => variantStyled[props.variant!]}
  ${(props) => sizeStyled[props.size!]}
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  transition: filter 0.25s ease-in-out;

  &:disabled {
    filter: grayscale(0.6);
  }

  ${(props) =>
    props.layoutMode === 'fullWidth' &&
    css`
      width: 100%;
    `}
`;

export default Button;
