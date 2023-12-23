import { checkIsLoggedIn } from '@/lib/applyAuth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '설정',
  robots: 'noindex',
};

export default async function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('pre-rendering test in settings');
  const isLoggedIn = await checkIsLoggedIn();
  if (!isLoggedIn) {
    return redirect(`/login?next=/setting`);
  }
  return <>{children}</>;
}
