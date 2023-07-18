import Home from "@/components/home/Home";
import TabLayout from "@/components/layout/TabLayout";
import { getItems } from "@/lib/api/items";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/query-core";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

export default async function Hydation() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  await queryClient.prefetchInfiniteQuery(["items"], () =>
    getItems({ mode: "trending" })
  );
  return (
    <Hydrate state={dehydratedState}>
      <TabLayout className="layout_padding">
        <Home />
      </TabLayout>
    </Hydrate>
  );
}
