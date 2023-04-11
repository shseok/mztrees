import React from 'react';
import styled from 'styled-components';
import LabelInput from '~/components/LabelInput';

interface Props {
  mode: 'login' | 'register';
}

const AuthForm = ({ mode }: Props) => {
  return (
    <Block>
      <InputGroup>
        <LabelInput label='아이디' />
        <LabelInput label='비밀번호' />
      </InputGroup>
    </Block>
  );
};

const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  //flex: 1;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default AuthForm;
