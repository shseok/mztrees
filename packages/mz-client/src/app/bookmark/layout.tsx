import { checkIsLoggedIn } from '@/lib/applyAuth';
import { siteConfig } from '@/lib/const';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: siteConfig.bookmark.title,
  robots: siteConfig.robotsNoIndex,
};

export default async function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('pre-rendering test in bookmark');
  const isLoggedIn = await checkIsLoggedIn();
  if (!isLoggedIn) {
    return redirect(`/login?next=/bookmark`);
  }
  return <>{children}</>;
}
