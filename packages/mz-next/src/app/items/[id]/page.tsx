import { getComments, getItem, getItems } from "@/lib/api/items";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import Item from "./item";

export const revalidate = 0;

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const itemData = await getItem(parseInt(id));

  return {
    title: itemData.title,
    description: itemData.body,
  };
}

type Params = {
  params: {
    id: string;
  };
};

export default async function Hydation({ params: { id } }: Params) {
  console.log("each item", parseInt(id), isNaN(parseInt(id)));
  // 왜 home인데 먼저 렌더링되며, id는 static하게 받아왔는데 또 이상한 id를 가져와서 에러가 발생하며 또 return처리를 했는데도 /api/items/NaN 보내는 현상은??
  if (isNaN(parseInt(id))) return;
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  const item = await getItem(parseInt(id));
  await queryClient.prefetchQuery(["comments"], () =>
    getComments(parseInt(id))
  );
  return (
    <Hydrate state={dehydratedState}>
      <Item item={item} />
    </Hydrate>
  );
}

export async function generateStaticParams() {
  const itemsResult = await getItems({ mode: "recent" });
  const items = itemsResult.list;
  return items.map((item) => ({ id: item.id.toString() }));
}
