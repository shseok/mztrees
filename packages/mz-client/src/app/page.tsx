import Home from '@/components/home/Home';
import TabLayout from '@/components/layout/TabLayout';
import { getItems } from '@/lib/api/items';
import { INITIAL_ITEM_LIMIT, siteConfig } from '@/lib/const';
import { getWeekRangeFromDate } from '@/lib/week';
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

export default async function HomePage({ searchParams }: HomeProps) {
  const { mode, start, end } = searchParams;

  const itemsResult = await getItems({
    mode: mode ?? 'trending',
    limit: INITIAL_ITEM_LIMIT,
    ...(mode === 'past'
      ? {
          startDate: start ?? getWeekRangeFromDate(new Date())[0],
          endDate: end ?? getWeekRangeFromDate(new Date())[1],
        }
      : {}),
  });

  return (
    <TabLayout className='layout_padding'>
      <Home initItemsResult={itemsResult} />
    </TabLayout>
  );
}
