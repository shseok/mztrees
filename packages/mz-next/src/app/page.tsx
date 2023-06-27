import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import ListUsers from "./list-user";
import { getItems } from "@/lib/api/items";
import Home from "./home";

export default async function Hydation({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["items"], () =>
    getItems({ mode: "trending" })
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      {/* <ListUsers /> */}
      <Home />
    </Hydrate>
  );
}
