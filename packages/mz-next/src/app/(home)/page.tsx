import { getItems } from "@/lib/api/items";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/query-core";
import Home from "./home";

export const revalidate = 0;

export default async function Hydation() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  await queryClient.prefetchInfiniteQuery(["items"], () =>
    getItems({ mode: "trending" })
  );
  return (
    <Hydrate state={dehydratedState}>
      <Home />
    </Hydrate>
  );
}
