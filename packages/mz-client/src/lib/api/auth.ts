import axios from 'axios';
import { User } from './types';

export async function userRegister(params: AuthParams) {
  const response = await axios.post<AuthResult>('/base/api/auth/register', params);
  return response.data;
}

export async function userLogin(params: AuthParams) {
  const response = await axios.post<AuthResult>('/base/api/auth/login', params);
  return response.data;
}

export async function userLogout() {
  await axios.post('/base/api/auth/logout');
}

export async function refreshToken() {
  const response = await axios.post<Tokens>(
    '/base/api/auth/refresh',
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
}

interface AuthParams {
  username: string;
  password: string;
}

export interface AuthResult {
  tokens: Tokens;
  user: User;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
