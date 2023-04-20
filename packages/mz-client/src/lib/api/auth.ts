import axios from 'axios';
import { client } from '~/lib/client';

export async function userRegister(params: AuthParams) {
  const response = await axios.post('http://localhost:4000/api/auth/register', params);
  const result = response.data;
  // 왜 굳이 쿠키를 가져와야하지?
  const cookieHeader = response.headers['set-cookie'];
  // const headers = createCookieHeaders(cookieHeader);
  return { result, headers: cookieHeader };
}

export async function userLogin(params: AuthParams) {
  const response = await axios.post('http://localhost:4000/api/auth/login', params);
  const result = await response.data;
  const cookieHeader = response.headers['set-cookie'];
  // const headers = createCookieHeaders(cookieHeader);
  return { result, headers: cookieHeader };
}

// main.tsx(root)에서? 쓰일예정
export async function getMyAccount() {
  const response = await client.get<AuthResult>('http://localhost:4000/api/me');
  return response.data;
}

// function createCookieHeaders(setCookieHeader: string[] | undefined) {
//   if (!setCookieHeader || setCookieHeader.length === 0) {
//     throw new Error('No cookie header found');
//   }
//   const headers = new Headers();
//   setCookieHeader.forEach((cookie) => {
//     headers.append('Set-Cookie', cookie);
//   });
//   return headers;
// }

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

export interface User {
  id: string;
  username: string;
}
