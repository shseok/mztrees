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

  return {
    title: itemData.title,
    description: itemData.body,
  };
}
export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export default async function ItemPage({ params: { id } }: Params) {
  const itemData = await getItem(parseInt(id));
  return <Item item={itemData} />;
}
