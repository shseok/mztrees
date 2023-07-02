import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import ListUsers from "./list-user";
import { getItems } from "@/lib/api/items";
import Home from "./home";
import { cookies } from "next/headers";
import styles from "@/styles/Home.module.scss";
import Test from "./test";
import TabLayout from "@/components/layout/TabLayout";
import { getMyAccount } from "@/lib/api/me";

async function fetchData() {
  const req = await fetch("http://localhost:3000/api/items");
  const result = req.json();
  return result;
}

export default async function Hydation({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("page", searchParams);

  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  // await queryClient.prefetchQuery(["items"], () => fetchData());
  return (
    <TabLayout className={styles.layout_padding}>
      <Test />
    </TabLayout>
    // <Hydrate state={dehydratedState}>
    // <ListUsers isUser={!!ac?.value} />
    //   {/* <Home /> */}
    // </Hydrate>
  );
}
