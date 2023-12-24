import BasicLayout from '@/components/layout/BasicLayout';
import { Suspense } from 'react';
import Loading from '@/components/system/PostLoading';
import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/const';

export const metadata: Metadata = {
  title: siteConfig.auth.register.title,
  robots: siteConfig.robotsNoIndex,
};

export default function Register() {
  return (
    <BasicLayout
      hasBackButton={true}
      title='회원가입'
      desktopHeaderVisible={false}
    >
      <Suspense fallback={<Loading />}>
        <AuthForm mode='register' />
      </Suspense>
    </BasicLayout>
  );
}
