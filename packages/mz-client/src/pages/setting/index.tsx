import React from 'react';
import styled from 'styled-components';
import { useOpenLogoutDialog } from '~/hooks/useOpenLoginDialog';
import { colors } from '~/lib/colors';

const SettingIndex = () => {
  const openLogoutDialog = useOpenLogoutDialog();
  return (
    <Block>
      <ListWrapper>
        <ListItem>내 계정</ListItem>
        <ListItem
          onClick={() => {
            openLogoutDialog('logout');
          }}
        >
          로그아웃
        </ListItem>
      </ListWrapper>
    </Block>
  );
};

const Block = styled.div`
  background: ${colors.gray0};
  flex: 1;
`;

const ListWrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li + li {
    border-top: 1px solid ${colors.gray0};
  }
`;
const ListItem = styled.li`
  padding: 16px;
  background: white;
  &:active {
    opacity: 0.7;
  }
`;

export default SettingIndex;
