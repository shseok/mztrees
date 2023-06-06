import axios from 'axios';
import { Bookmark, GetBookmarksResult } from './types';

export const createBookmark = async (itemId: number, contorller?: AbortController) => {
  const response = await axios.post<Bookmark>(
    '/base/api/bookmark/',
    { itemId },
    {
      signal: contorller?.signal,
    },
  );
  return response.data;
};

export const deleteBookmark = async (itemId: number, contorller?: AbortController) => {
  await axios.delete(`/base/api/bookmark/`, {
    params: {
      itemId,
    },
    signal: contorller?.signal,
  });
};

export const getBookmarks = async (cursor?: number) => {
  const response = await axios.get<GetBookmarksResult>('/base/api/bookmark/', {
    params: { cursor },
  });
  return response.data;
};
