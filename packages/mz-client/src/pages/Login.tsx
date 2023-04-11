import React from 'react';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import { useGoBack } from '~/hooks/useGoback';
import AuthForm from '~/components/AuthForm';
import FullHeightPage from '~/components/FullHeightPage';

const Login = () => {
  const goBack = useGoBack();
  return (
    <FullHeightPage>
      <Header title='로그인' headerLeft={<HeaderBackButton onClick={goBack} />} />
      <AuthForm mode='login' />
    </FullHeightPage>
  );
};

export default Login;
