import React from 'react';
import HeaderBackButton from '~/components/base/HeaderBackButton';
import Header from '~/components/base/Header';
import { useGoBack } from '~/hooks/useGoback';
import FullHeightPage from '~/components/system/FullHeightPage';
import AuthForm from '~/components/auth/AuthForm';

const Register = () => {
  const goBack = useGoBack();

  return (
    <FullHeightPage>
      <Header title='회원가입' headerLeft={<HeaderBackButton onClick={goBack} />} />
      <AuthForm mode='register' />
    </FullHeightPage>
  );
};

export default Register;
