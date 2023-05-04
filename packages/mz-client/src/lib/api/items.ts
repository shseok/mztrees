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

export async function likeItem(itemId: number) {
  const response = await axios.post<LikeItemResult>(`/base/api/items/${itemId}/likes`);
  return response.data;
}

export async function unlikeItem(itemId: number) {
  const response = await axios.delete<LikeItemResult>(`/base/api/items/${itemId}/likes`);
  return response.data;
}

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
}
