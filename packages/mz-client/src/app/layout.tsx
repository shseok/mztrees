import '../styles/global.scss';
import Providers from '@/utils/Providers';
import GlobalBottomSheetModal from '@/components/system/GlobalBottomSheetModal';
import type { Metadata, Viewport } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { colors } from '@/lib/colors';
import { pretendard } from '@/lib/fonts';
import { siteConfig } from '@/lib/const';

export const metadata: Metadata = {
  title: siteConfig.root.title,
  description: siteConfig.root.description,
  metadataBase: new URL(siteConfig.imageDomain),
  openGraph: {
    type: siteConfig.type,
    url: siteConfig.mainDomain,
    title: siteConfig.root.title,
    description: siteConfig.root.description,
    images: siteConfig.root.imageUrl,
    siteName: siteConfig.site,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.root.title,
    description: siteConfig.root.description,
    images: siteConfig.root.imageUrl,
    creator: siteConfig.creator,
    site: siteConfig.site,
  },
  icons: {
    icon: [siteConfig.root.iconUrl.favicon],
    apple: [siteConfig.root.iconUrl.appleTouchIcon],
  },
  manifest: siteConfig.root.manifestUrl,
};

export const viewport: Viewport = {
  themeColor: colors.primary,
};

// export const revalidate = 60; // 60초 이후 refresh > 모든 페이지 모두 ssr

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' className={pretendard.className}>
      <body>
        <NextTopLoader
          color={colors.primary}
          showSpinner={false}
          shadow={false}
        />
        <Providers>{children}</Providers>
        <GlobalBottomSheetModal />
      </body>
    </html>
  );
}
