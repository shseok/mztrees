import { getItem } from "@/lib/api/items";
// import type { Metadata } from "next";
import { Metadata } from "next";

type Params = {
  params: {
    id: string;
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

export default async function Items({ params: { id } }: Params) {
  const itemData = await getItem(parseInt(id));
  console.log("item", itemData);
  return <div>Items {id}</div>;
}
