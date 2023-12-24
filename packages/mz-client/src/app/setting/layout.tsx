import { checkIsLoggedIn } from '@/lib/applyAuth';
import { siteConfig } from '@/lib/const';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: siteConfig.setting.title,
  robots: siteConfig.robotsNoIndex,
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
