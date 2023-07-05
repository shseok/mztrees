import { getComments, getItem } from "@/lib/api/items";
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
  console.log("each item");
  const item = await getItem(parseInt(id));
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  await queryClient.prefetchQuery(["comments"], () =>
    getComments(parseInt(id))
  );
  return (
    <Hydrate state={dehydratedState}>
      <Item item={item} />
    </Hydrate>
  );
}

// export async function generateStaticParams() {
//   const usersData: Promise<User[]> = getAllUsers();
//   const users = await usersData;

//   return users.map((user) => ({
//     userId: user.id.toString(),
//   }));
// }
