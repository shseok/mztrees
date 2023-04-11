import React from 'react';
import HeaderBackButton from '~/components/HeaderBackButton';
import Header from '~/components/Header';
import { useGoBack } from '~/hooks/useGoback';
import FullHeightPage from '~/components/FullHeightPage';
import AuthForm from '~/components/AuthForm';

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
