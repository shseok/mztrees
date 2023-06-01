import axios from 'axios';
import {
  Comment,
  GetItemsResult,
  Item,
  LikeCommentResult,
  LikeItemResult,
  ListMode,
  UnlikeCommentResult,
} from './types';
import qs from 'qs';

export async function createItem(params: CreateItemParams) {
  const response = await axios.post<Item>('/base/api/items', params);
  return response.data;
}

export async function getItems({ mode, cursor }: { cursor?: number; mode: ListMode }) {
  const resonse = await axios.get<GetItemsResult>(
    '/base/api/items'.concat(qs.stringify({ mode, cursor }, { addQueryPrefix: true })),
  );
  return resonse.data;
}

export async function getItem(itemId: number) {
  const response = await axios.get<Item>(`/base/api/items/${itemId}`);
  return response.data;
}

export async function deleteItem(itemId: number) {
  return axios.delete(`/base/api/items/${itemId}`);
}

export async function updateItem({
  itemId,
  title,
  body,
}: {
  itemId: number;
  title: string;
  body: string;
}) {
  const response = await axios.patch(`/base/api/items/${itemId}`, { title, body, tags: [] });
  return response.data;
}

export async function likeItem(itemId: number, controller?: AbortController) {
  const response = await axios.post<LikeItemResult>(
    `/base/api/items/${itemId}/likes`,
    {},
    { signal: controller?.signal },
  );
  return response.data;
}

export async function unlikeItem(itemId: number, controller?: AbortController) {
  const response = await axios.delete<LikeItemResult>(`/base/api/items/${itemId}/likes`, {
    signal: controller?.signal,
  });
  return response.data;
}

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
}

export async function getComments(itemId: number) {
  const response = await axios.get<Comment[]>(`/base/api/items/${itemId}/comments`);
  return response.data;
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
  const response = await axios.post<Comment>(`/base/api/items/${itemId}/comments`, {
    text,
    parentCommentId,
  });
  return response.data;
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
  const response = await axios.patch<Comment>(`/base/api/items/${itemId}/comments/${commentId}`, {
    text,
  });
  return response.data;
}

export async function deleteComment({ itemId, commentId }: { itemId: number; commentId: number }) {
  const response = await axios.delete(`/base/api/items/${itemId}/comments/${commentId}`);
  return response.data;
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
  const response = await axios.post<LikeCommentResult>(
    `/base/api/items/${itemId}/comments/${commentId}/likes`,
    {},
    { signal: controller?.signal },
  );
  return response.data;
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
  const response = await axios.delete<UnlikeCommentResult>(
    `/base/api/items/${itemId}/comments/${commentId}/likes`,
    { signal: controller?.signal },
  );
  return response.data;
}
