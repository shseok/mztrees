"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getItems } from "@/lib/api/items";
import TabLayout from "@/components/layout/TabLayout";
import styles from "@/styles/Home.module.scss";

export default function ListUsers() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems({ mode: "recent" }),
  });

  console.log(data);

  return (
    <main style={{ maxWidth: 1200, marginInline: "auto", padding: 20 }}>
      <TabLayout className={styles.layout_padding}></TabLayout>
    </main>
  );
}
