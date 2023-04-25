import axios from 'axios';

export async function userRegister(params: AuthParams) {
  const response = await axios.post<AuthResult>('/base/api/auth/register', params);
  return response.data;
}

export async function userLogin(params: AuthParams) {
  const response = await axios.post<AuthResult>('/base/api/auth/login', params);
  return response.data;
}

export async function getMyAccount() {
  // const response = await fetch('http://localhost:4000/api/me', {
  //   method: 'GET',
  //   credentials: 'include',
  // });
  // const data = await response.json();
  // return data;
  try {
    const response = await axios.get<User>('/base/api/me', {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

let getMyAccountPromise: Promise<User> | null = null;
export async function getMemorizedMyAccount() {
  if (getMyAccountPromise === null) {
    getMyAccountPromise = getMyAccount();
  }
  return getMyAccountPromise;
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

export interface User {
  id: string;
  username: string;
}
