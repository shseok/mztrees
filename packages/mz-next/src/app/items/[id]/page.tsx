import { getItem } from "@/lib/api/items";
import { Metadata } from "next";
import Item from "./item";

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
// TODO: client component로 변경하기

export default function Hydation({ params: { id }, searchParams }: Params) {
  console.log("each item", parseInt(id), isNaN(parseInt(id)), searchParams);
  // const queryClient = getQueryClient();
  // const dehydratedState = dehydrate(queryClient);
  // // const item = await getItem(parseInt(id));
  // await queryClient.prefetchQuery(["comments"], () =>
  //   getComments(parseInt(id))
  // );
  return (
    // <Hydrate state={dehydratedState}>
    <Item itemId={id} />
    // </Hydrate>
  );
}

// if server is not working, not build
// export async function generateStaticParams() {
//   const itemsResult = await getItems({ mode: "recent" });
//   const items = itemsResult.list;
//   return items.map((item) => ({ id: item.id.toString() }));
// }
