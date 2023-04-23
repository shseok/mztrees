import React from 'react';
import AuthForm from '~/components/auth/AuthForm';
import BasicLayout from '~/components/layout/BasicLayout';

const Register = () => {
  return (
    <BasicLayout hasBackButton={true} title='회원가입'>
      <AuthForm mode='register' />
    </BasicLayout>
  );
};

export default Register;
