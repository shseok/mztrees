import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as Logo } from '~/assets/logo.svg';

export interface HeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const Header = ({ title = <Logo />, headerLeft, headerRight }: HeaderProps) => {
  return (
    <Block>
      {headerLeft && <HeaderSide position='left'>{headerLeft}</HeaderSide>}
      <Title>{title}</Title>
      {headerRight && <HeaderSide position='right'>{headerRight}</HeaderSide>}
    </Block>
  );
};

const Block = styled.header`
  position: relative;
  height: 56px;
  border-bottom: 1px solid ${colors.gray0};
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  color: ${colors.gray5};
  font-size: 18px;
  font-weight: 600;

  svg {
    display: block;
    width: 84px;
    height: 17px;
  }
`;

const HeaderSide = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${(props: { position: 'left' | 'right' }) => props.position}: 8px;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Header;
