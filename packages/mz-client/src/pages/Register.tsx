import React from 'react';
import styled from 'styled-components';
import HeaderBackButton from '~/components/HeaderBackButton';
import Header from '~/components/Header';
import { useGoBack } from '~/hooks/useGoback';

const Register = () => {
  const goBack = useGoBack();

  return (
    <Page>
      <Header title='회원가입' headerLeft={<HeaderBackButton onClick={goBack} />} />
    </Page>
  );
};

const Page = styled.div``;

export default Register;
