import { stringify } from 'qs';
import { fetchClient } from '../client';
import type {
  Comment,
  ExtractedUrlsResult,
  GetItemsResult,
  Item,
  ItemForSitemap,
  LikeCommentResult,
  LikeItemResult,
  SortMode,
  MutateItemParams,
  Tag,
  UnlikeCommentResult,
} from '@/types/db';

export async function createItem(params: MutateItemParams) {
  const response = await fetchClient.post<Item>('/api/items', params);
  return response;
}

export async function getAllItems() {
  const response = await fetchClient.get<ItemForSitemap[]>('/api/items/all');
  return response;
}

export async function getItems({
  mode,
  tag,
  cursor,
  startDate,
  endDate,
}: {
  mode: SortMode;
  tag?: Tag;
  cursor?: number;
  startDate?: string;
  endDate?: string;
}) {
  const query = stringify(
    { mode, cursor, tag, startDate, endDate },
    { addQueryPrefix: true } //  tags > arrayFormat: "repeat"
  );
  const resonse = await fetchClient.get<GetItemsResult>(
    '/api/items'.concat(query)
  );
  return resonse;
}

export async function getItem(itemId: number) {
  const response = await fetchClient.get<Item>(`/api/items/${itemId}`);
  return response;
}

export async function deleteItem(itemId: number) {
  return fetchClient.delete(`/api/items/${itemId}`);
}

export async function updateItem(itemId: number, params: MutateItemParams) {
  const response = await fetchClient.patch(`/api/items/${itemId}`, params);
  return response;
}

export async function likeItem(itemId: number, controller?: AbortController) {
  const response = await fetchClient.post<LikeItemResult>(
    `/api/items/${itemId}/likes`,
    {},
    { signal: controller?.signal }
  );
  return response;
}

export async function unlikeItem(itemId: number, controller?: AbortController) {
  const response = await fetchClient.delete<LikeItemResult>(
    `/api/items/${itemId}/likes`,
    {
      signal: controller?.signal,
    }
  );
  return response;
}

export async function getComments(itemId: number) {
  const response = await fetchClient.get<Comment[]>(
    `/api/items/${itemId}/comments`
  );
  return response;
}

export async function createComment({
  itemId,
  text,
  parentCommentId,
}: {
  itemId: number;
  text: string;
  parentCommentId?: number;
}) {
  const response = await fetchClient.post<Comment>(
    `/api/items/${itemId}/comments`,
    {
      text,
      parentCommentId,
    }
  );
  return response;
}

export async function editComment({
  itemId,
  commentId,
  text,
}: {
  itemId: number;
  commentId: number;
  text: string;
}) {
  const response = await fetchClient.patch<Comment>(
    `/api/items/${itemId}/comments/${commentId}`,
    {
      text,
    }
  );
  return response;
}

export async function deleteComment({
  itemId,
  commentId,
}: {
  itemId: number;
  commentId: number;
}) {
  const response = await fetchClient.delete(
    `/api/items/${itemId}/comments/${commentId}`
  );
  return response;
}

export async function likeComment({
  itemId,
  commentId,
  controller,
}: {
  itemId: number;
  commentId: number;
  controller?: AbortController;
}) {
  const response = await fetchClient.post<LikeCommentResult>(
    `/api/items/${itemId}/comments/${commentId}/likes`,
    {},
    { signal: controller?.signal }
  );
  return response;
}

export async function unlikeComment({
  itemId,
  commentId,
  controller,
}: {
  itemId: number;
  commentId: number;
  controller?: AbortController;
}) {
  const response = await fetchClient.delete<UnlikeCommentResult>(
    `/api/items/${itemId}/comments/${commentId}/likes`,
    { signal: controller?.signal }
  );
  return response;
}

export async function getImageUrl(link: string) {
  const response = await fetchClient.post<ExtractedUrlsResult>(
    '/api/items/urls',
    {
      link,
    }
  );

  return response;
}
