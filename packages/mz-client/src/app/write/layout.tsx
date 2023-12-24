import { GifSelectorProvider } from '@/context/GifSelectorContext';
import { ImageViewerProvider } from '@/context/ImageViewerContext';
import { WriteProvider } from '@/context/WriteContext';
import { checkIsLoggedIn } from '@/lib/applyAuth';
import { siteConfig } from '@/lib/const';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: siteConfig.write.title,
  robots: siteConfig.robotsNoIndex,
};

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log("pre-rendering test in write");
  const isLoggedIn = await checkIsLoggedIn();
  if (!isLoggedIn) {
    return redirect(`/login?next=/write`);
  }
  return (
    <ImageViewerProvider>
      <WriteProvider>
        <GifSelectorProvider>{children}</GifSelectorProvider>
      </WriteProvider>
    </ImageViewerProvider>
  );
}
