import Home from '@/components/home/Home';
import TabLayout from '@/components/layout/TabLayout';
import { siteConfig } from '@/lib/const';
import type { HomeProps } from '@/types/custom';

export function generateMetadata({ searchParams }: HomeProps) {
  const modeInfo = siteConfig.mode(searchParams);
  return {
    ...modeInfo,
    metadataBase: new URL(siteConfig.imageDomain),
    openGraph: {
      type: siteConfig.type,
      url: siteConfig.getModeUrl(searchParams.mode),
      title: modeInfo.title,
      description: modeInfo.description,
      images: siteConfig.root.imageUrl,
      siteName: siteConfig.site,
    },
    twitter: {
      card: 'summary_large_image',
      title: modeInfo.title,
      description: modeInfo.description,
      images: siteConfig.root.imageUrl,
      creator: siteConfig.creator,
      siteName: siteConfig.site,
    },
  };
}

export default async function HomePage() {
  return (
    <TabLayout className='layout_padding'>
      <Home />
    </TabLayout>
  );
}
