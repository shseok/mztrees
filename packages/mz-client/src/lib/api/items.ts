import axios from 'axios';
import { GetItemsResult, Item } from './types';
import qs from 'qs';
import { LikeItemResult } from './types';

export async function createItem(params: CreateItemParams) {
  const response = await axios.post<Item>('/base/api/items', params);
  return response.data;
}

export async function getItems(cursor?: number) {
  const resonse = await axios.get<GetItemsResult>(
    '/base/api/items'.concat(qs.stringify({ cursor }, { addQueryPrefix: true })),
  );
  return resonse.data;
}

export async function getItem(itemId: number) {
  const response = await axios.get<Item>(`/base/api/items/${itemId}`);
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
