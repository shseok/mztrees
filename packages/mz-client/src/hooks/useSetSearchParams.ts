"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
// import useSearchParams from "./useSearchParams";

// Get a new searchParams string by merging the current searchParams with a provided key/value pair
export default function useSetSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  // REFACTOR: useSearchParams를 사용하여 getAll, entries등을 이용
  const setSearchParams = useCallback(
    (obj: Record<string, string>) => {
      const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams();
        // const params = new URLSearchParams(searchParams);
        params.set(name, value);
        return params.toString();
      };
      const query = [];
      for (const [key, value] of Object.entries(obj)) {
        const param = createQueryString(key, value);
        query.push(param);
      }
      const parameters = query.join("&");
      router.push(pathname + "?" + parameters);
    },
    [router, pathname]
  );

  return setSearchParams;
}
