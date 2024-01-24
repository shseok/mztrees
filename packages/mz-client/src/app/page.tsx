import Home from '@/components/home/Home';
import TabLayout from '@/components/layout/TabLayout';
import { getItems } from '@/lib/api/items';
import { siteConfig } from '@/lib/const';
import { HomeProps } from '@/types/custom';
import getQueryClient from '@/utils/getQueryClient';
import Hydrate from '@/utils/hydrate.client';
import { dehydrate } from '@tanstack/react-query';

// export const dynamic = "force-dynamic";

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

export default async function Hydation() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  await queryClient.prefetchInfiniteQuery(['items'], () =>
    getItems({ mode: 'trending' })
  );
  return (
    <Hydrate state={dehydratedState}>
      <TabLayout className='layout_padding'>
        <Home />
      </TabLayout>
    </Hydrate>
  );
}
