import { getItem } from '@/lib/api/items';
import { Metadata } from 'next';
import Item from '@/components/items/Item';
import { siteConfig } from '@/lib/const';

type Params = {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const itemData = await getItem(parseInt(id));
  const { title, description, imageUrl, path } = siteConfig.post(itemData);
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      images: imageUrl,
      siteName: siteConfig.site,
    },
    twitter: {
      card: itemData.thumbnail ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl,
      creator: siteConfig.creator,
      site: siteConfig.site,
    },
  };
}
export const dynamic = 'force-dynamic';
// export const fetchCache = "force-no-store";

export default async function ItemPage({ params: { id } }: Params) {
  const itemData = await getItem(parseInt(id));
  return <Item item={itemData} />;
}
