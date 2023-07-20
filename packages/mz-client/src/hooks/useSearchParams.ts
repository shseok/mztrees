import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

export default useSearchParams as () => ReadonlyURLSearchParams & {
  size: number;
};
