"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useGoBack = () => {
  const router = useRouter();
  return useCallback(() => router.back(), [router]);
};
