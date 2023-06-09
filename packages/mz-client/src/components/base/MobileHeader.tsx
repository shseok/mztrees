import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as Logo } from '~/assets/logo.svg';
import { media } from '~/lib/media';

export interface HeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const MobileHeader = ({ title = <Logo />, headerLeft, headerRight, className }: HeaderProps) => {
  return (
    <Block className={className}>
      {headerLeft && <HeaderSide position='left'>{headerLeft}</HeaderSide>}
      <Title className='title'>{title}</Title>
      {headerRight && <HeaderSide position='right'>{headerRight}</HeaderSide>}
    </Block>
  );
};

const Block = styled.header`
  position: relative;
  min-height: 56px;
  border-bottom: 1px solid ${colors.gray0};
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${media.mobile} {
    display: none;
  }
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

export default MobileHeader;
