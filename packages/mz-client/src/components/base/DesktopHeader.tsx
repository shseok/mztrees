import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as Logo } from '~/assets/logo.svg';
import { media } from '~/lib/media';
import Button from '../system/Button';
import SearchArea from './SearchArea';

const DesktopHeader = () => {
  return (
    <Block>
      <StyledLogo />
      <Content>
        <Addon></Addon>
        <Addon>
          <SearchArea />
          <Buttons>
            <Button variant='tertiary' size='small'>
              로그인
            </Button>
            <Button size='small'>회원가입</Button>
          </Buttons>
        </Addon>
      </Content>
    </Block>
  );
};

const Block = styled.header`
  min-height: 64px;
  border-bottom: 1px solid ${colors.gray0};
  padding: 0 16px;
  display: flex;
  align-items: center;
  display: none;
  ${media.mobile} {
    display: flex;
  }
  ${media.widescreen} {
    padding: 0;
  }

  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
`;

const StyledLogo = styled(Logo)`
  display: block;
  height: 17px;
  width: auto;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Addon = styled.div`
  display: flex;
  align-items: center;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

export default DesktopHeader;
