import React from 'react';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import styled from 'styled-components';
import { useGoBack } from '~/hooks/useGoback';
import AuthForm from '~/components/AuthForm';

const Login = () => {
  const goBack = useGoBack();
  return (
    <Page>
      <Header title='로그인' headerLeft={<HeaderBackButton onClick={goBack} />} />
      <AuthForm mode='login' />
    </Page>
  );
};
const Page = styled.div``;

export default Login;
