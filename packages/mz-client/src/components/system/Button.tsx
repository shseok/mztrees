import React, { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { colors } from '~/lib/colors';
import { hover } from '~/lib/styles';

interface ButtonProps {
  layoutmode?: 'inline' | 'fullWidth';
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium';
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonProps {
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { layoutmode: layoutmode = 'inline', variant = 'primary', size = 'medium', to, ...rest }: Props,
    ref,
  ) => {
    const location = useLocation();
    return to ? (
      <LinkedButton
        ref={ref as any}
        layoutmode={layoutmode}
        variant={variant}
        size={size}
        children={rest.children}
        className={rest.className}
        // style={rest.style}
        to={to}
        state={{ from: location, redirect: '/' }}
        // replace={true}
      />
    ) : (
      <StyledButton
        ref={ref as any}
        layoutmode={layoutmode}
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

const sharedStyles = css<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
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
    props.layoutmode === 'fullWidth' &&
    css`
      width: 100%;
    `}
`;

const StyledButton = styled.button`
  ${sharedStyles}
`;

const LinkedButton = styled(Link)`
  ${sharedStyles}
  text-decoration: none;
`;

export default Button;
