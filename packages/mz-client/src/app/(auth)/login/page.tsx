import BasicLayout from '@/components/layout/BasicLayout';
import { Suspense } from 'react';
import Loading from '@/components/system/PostLoading';
import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/const';

export const metadata: Metadata = {
  title: siteConfig.auth.login.title,
  robots: siteConfig.robotsNoIndex,
};

export default function Login() {
  return (
    <BasicLayout
      hasBackButton={true}
      title='로그인'
      desktopHeaderVisible={false}
    >
      <Suspense fallback={<Loading />}>
        <AuthForm mode='login' />
      </Suspense>
    </BasicLayout>
  );
}
