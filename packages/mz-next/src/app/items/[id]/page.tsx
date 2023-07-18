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

export default async function ItemPage({
  params: { id },
  searchParams,
}: Params) {
  const itemData = await getItem(parseInt(id));
  console.log("each item", parseInt(id), searchParams, itemData);
  return <Item item={itemData} />;
}

// if server is not working, not build
// export async function generateStaticParams() {
//   const itemsResult = await getItems({ mode: "recent" });
//   const items = itemsResult.list;
//   return items.map((item) => ({ id: item.id.toString() }));
// }
