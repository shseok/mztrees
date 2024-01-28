import Home from '@/components/home/Home';
import TabLayout from '@/components/layout/TabLayout';
import { getItems } from '@/lib/api/items';
import { INITIAL_ITEM_LIMIT, siteConfig } from '@/lib/const';
import type { HomeProps } from '@/types/custom';

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

export default async function HomePage({ searchParams }: HomeProps) {
  // const mode = (searchParams.mode as SortMode | undefined) ?? 'trending';
  //   mode: SortMode;
  // tag?: Tag;
  // cursor?: number;
  // startDate?: string;
  // endDate?: string;
  const { mode, tag, startDate, endDate } = searchParams;

  const initialItems = await getItems({
    mode: mode ?? 'trending',
    tag,
    startDate,
    endDate,
    limit: INITIAL_ITEM_LIMIT,
  });

  return (
    <TabLayout className='layout_padding'>
      <Home items={initialItems} />
    </TabLayout>
  );
}
