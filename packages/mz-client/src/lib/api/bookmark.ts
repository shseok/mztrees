import { stringify } from "qs";
import { fetchClient } from "../client";
import { Bookmark, GetBookmarksResult } from "@/types/db";

export const createBookmark = async (
  itemId: number,
  contorller?: AbortController
) => {
  const response = await fetchClient.post<Bookmark>(
    "/api/bookmark/",
    { itemId },
    {
      signal: contorller?.signal,
    }
  );
  return response;
};

export const deleteBookmark = async (
  itemId: number,
  contorller?: AbortController
) => {
  const query = stringify({ itemId }, { addQueryPrefix: true });
  await fetchClient.delete(`/api/bookmark/`.concat(query), {
    signal: contorller?.signal,
  });
};

export const getBookmarks = async (cursor?: number) => {
  const query = cursor ? stringify({ cursor }, { addQueryPrefix: true }) : "";
  const response = await fetchClient.get<GetBookmarksResult>(
    "/api/bookmark".concat(query)
  );
  return response;
};
