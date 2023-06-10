import React from 'react';
import styled from 'styled-components';
import { useUser } from '~/hooks/stores/userStore';
import { colors } from '~/lib/colors';
import Input from '../system/Input';
import Button from '../system/Button';

const AccountSetting = () => {
  const user = useUser();
  if (!user) return null;
  return (
    <Block>
      <div>
        <Section>
          <h4>아이디</h4>
          <Username>{user.username} 님</Username>
        </Section>
        <Section>
          <h4>비밀번호</h4>
          <InputGroup>
            <Input placeholder='현재 비밀번호' type='password' />
            <Input placeholder='새 비밀번호' type='password' />
          </InputGroup>
          <Button layoutmode='fullWidth' variant='primary' size='small'>
            비밀번호 변경
          </Button>
        </Section>
      </div>
      <UnregisterButton>계정 탈퇴</UnregisterButton>
    </Block>
  );
};
const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex: 1;
  justify-content: space-between;
`;

const Section = styled.div`
  h4 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 16px;
    color: ${colors.gray3};
  }

  & + & {
    margin-top: 32px;
  }
`;

const Username = styled.div`
  font-size: 16px;
  color: ${colors.gray5};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const UnregisterButton = styled(Button)`
  font-size: 16px;
  background: ${colors.destructive};
`;

export default AccountSetting;
