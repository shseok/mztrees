import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as Logo } from '~/assets/logo.svg';
import { media } from '~/lib/media';
import Button from '../system/Button';
import SearchArea from './SearchArea';
import { Link } from 'react-router-dom';
import { getMyAccount } from '~/lib/api/auth';
import { User } from '~/lib/api/types';
import UserAddon from './UserAddon';

const DesktopHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getMyAccount();
      setUser(result);
    };
    fetchData();
  }, []);

  return (
    <Block>
      <HomeLink to='/'>
        <StyledLogo />
      </HomeLink>
      <Content>
        <Addon></Addon>
        <Addon>
          <SearchArea />
          {user ? (
            <UserAddon username={user.username} profileImage={''} />
          ) : (
            <Buttons>
              <Button variant='tertiary' size='small' to='/login'>
                로그인
              </Button>
              <Button size='small' to='/register'>
                회원가입
              </Button>
            </Buttons>
          )}
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
  max-width: 1150px;
  margin-right: auto;
  margin-left: auto;
`;

const HomeLink = styled(Link)`
  display: block;
  color: inherit;
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
