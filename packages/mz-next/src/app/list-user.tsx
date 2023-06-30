"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getItems } from "@/lib/api/items";
import TabLayout from "@/components/layout/TabLayout";
import styles from "@/styles/Home.module.scss";
import { useSetUser } from "@/hooks/stores/userStore";
import { getMyAccount } from "@/lib/api/me";

async function fetchData() {
  const req = await fetch("http://localhost:3000/api/items");
  const result = req.json();
  return result;
}

export default function ListUsers({ isUser }: { isUser: boolean }) {
  console.log("list-user", isUser);

  // const { data, isLoading, isFetching, error } = useQuery({
  //   queryKey: ["items"],
  //   queryFn: () => fetchData(),
  // });

  // const set = useSetUser();
  // if (isUser) {
  //   try {
  //     const user = await getMyAccount();
  //     set(user);
  //   } catch (e) {
  //     set(null);
  //   }
  // }
  // console.log(data);

  return <TabLayout className={styles.layout_padding}></TabLayout>;
}
