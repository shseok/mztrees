import { getAllItems } from '@/lib/api/items';
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN!;

// the sitemap objects that is generated dynamically
const generatePostsSitemapObjects = async () => {
  const posts = await getAllItems();
  console.log(posts);
  return posts.map((post) => ({
    slug: post.id.toString(),
    updatedAt: new Date(post.updatedAt),
  }));
};

// the static sitemap objects
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: BASE_URL,
      priority: 1,
    },
    ...(await generatePostsSitemapObjects()).map((o) => ({
      url: `${BASE_URL}/items/${o.slug}`,
      lastModified: o.updatedAt,
    })),
  ];
}

export const dynamic = 'force-dynamic';
