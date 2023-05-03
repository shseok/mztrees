import axios from 'axios';
import { GetItemsResult, User } from './types';
import qs from 'qs';

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

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
}

interface Item {
  id: number;
  title: string;
  body: string;
  link: string;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}
