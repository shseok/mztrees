import { fetchClient } from "../client";
import { SearchItemsResult } from "./types";

export async function searchItems({
  q,
  offset,
}: {
  q: string;
  offset?: number;
}) {
  const response = await fetchClient.get<SearchItemsResult>(
    "/base/api/search",
    {
      params: {
        q,
        offset,
      },
    }
  );

  return response;
}
