import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import ListUsers from "./list-user";
import { getItems } from "@/lib/api/items";
import Home from "./home";
import { cookies } from "next/headers";
import { getMyAccount } from "@/lib/api/me";
import { useSetUser } from "@/hooks/stores/userStore";

export default async function Hydation({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // console.log(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["items"], () =>
    getItems({ mode: "trending" })
  );
  const dehydratedState = dehydrate(queryClient);
  const cookieStore = cookies();
  const ac = cookieStore.get("access_token");
  const re = cookieStore.get("refresh_token");
  const a = cookieStore.getAll("Set-Cookie");
  const set = useSetUser();
  if (ac?.value) {
    const user = await getMyAccount();
    if (user) {
      set(user);
    }
  }
  return (
    <Hydrate state={dehydratedState}>
      <ListUsers />
      {/* <Home /> */}
    </Hydrate>
  );
}
