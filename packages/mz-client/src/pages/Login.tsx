import React from 'react';
import AuthForm from '~/components/auth/AuthForm';
import BasicLayout from '~/components/layout/BasicLayout';

const Login = () => {
  return (
    <BasicLayout hasBackButton={true} title='로그인'>
      <AuthForm mode='login' />
    </BasicLayout>
  );
};

export default Login;
