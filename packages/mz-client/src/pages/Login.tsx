import React from 'react';
import Header from '~/components/base/Header';
import HeaderBackButton from '~/components/base/HeaderBackButton';
import { useGoBack } from '~/hooks/useGoback';
import AuthForm from '~/components/auth/AuthForm';
import FullHeightPage from '~/components/system/FullHeightPage';

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
