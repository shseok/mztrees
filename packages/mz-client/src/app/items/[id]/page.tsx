import { getItem } from "@/lib/api/items";
import { Metadata } from "next";
import Item from "@/components/items/Item";

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
  const shortenDescription = itemData.body
    .slice(0, 300)
    .concat(itemData.body.length > 300 ? "..." : "");

  return {
    title: itemData.title,
    description: shortenDescription,
    openGraph: {
      title: itemData.title,
      description: shortenDescription,
      url: itemData.link,
      images:
        itemData.thumbnail?.url ??
        "https://img.mztrees.com/not-fount-image.svg",
      authors: itemData.author,
    },
    twitter: {
      card: itemData.thumbnail ? "summary_large_image" : "summary",
      title: itemData.title,
      description: shortenDescription,
      creator: "@mztrees",
      images:
        itemData.thumbnail?.url ??
        "https://img.mztrees.com/not-fount-image.svg",
    },
  };
}
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export default async function ItemPage({ params: { id } }: Params) {
  const itemData = await getItem(parseInt(id));
  return <Item item={itemData} />;
}
