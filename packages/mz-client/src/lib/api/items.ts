import axios from 'axios';
import { User } from './types';

export async function createItem(params: CreateItemParams) {
  const response = await axios.post<Item>('/base/api/items', params);
  return response.data;
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
