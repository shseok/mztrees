import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import useSearchParams from "./useSearchParams";

// Get a new searchParams string by merging the current searchParams with a provided key/value pair
export default function useSetSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = useCallback(
    (mode: Record<string, string>) => {
      const createQueryString = (name: string, value: string) => {
        // const params = new URLSearchParams(searchParams.toString());
        const params = new URLSearchParams(searchParams);
        params.set(name, value);

        return params.toString();
      };
      router.push(pathname + "?" + createQueryString(mode.name, mode.value));
    },
    [router, pathname, searchParams]
  );

  return setSearchParams;
}
