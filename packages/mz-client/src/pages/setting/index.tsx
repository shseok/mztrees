import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import TabLayout from '~/components/layout/TabLayout';
import { useOpenLogoutDialog } from '~/hooks/useOpenLoginDialog';
import { colors } from '~/lib/colors';

const SettingIndex = () => {
  const openLogoutDialog = useOpenLogoutDialog();
  return (
    <TabLayout>
      <Block>
        <ListWrapper>
          <ListItemLink to='/setting/account'>내 계정</ListItemLink>
          <ListItem
            onClick={() => {
              openLogoutDialog('logout');
            }}
          >
            로그아웃
          </ListItem>
        </ListWrapper>
      </Block>
    </TabLayout>
  );
};

const Block = styled.div`
  background: ${colors.gray0};
  flex: 1;
`;

const ListWrapper = styled.ul`
  * + li {
    border-top: 1px solid ${colors.gray0};
  }
`;

const ListItemStyle = css`
  padding: 16px;
  background: white;
  color: ${colors.gray5};

  &:hover,
  &:active {
    opacity: 0.7;
  }
`;
const ListItem = styled.li`
  ${ListItemStyle}
`;

const ListItemLink = styled(Link)`
  text-decoration: none;
  display: block;
  ${ListItemStyle};
`;

export default SettingIndex;
