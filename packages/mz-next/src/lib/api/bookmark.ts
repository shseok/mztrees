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
  await fetchClient.delete(`/api/bookmark/`, {
    params: {
      itemId,
    },
    signal: contorller?.signal,
  });
};

export const getBookmarks = async (cursor?: number) => {
  const response = await fetchClient.get<GetBookmarksResult>("/api/bookmark/", {
    params: { cursor },
  });
  return response;
};
