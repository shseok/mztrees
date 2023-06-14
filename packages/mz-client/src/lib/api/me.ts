import axios from 'axios';
import { User } from './types';

export async function getMyAccount(accessToken?: string, controller?: AbortController) {
  const response = await axios.get<User>('/base/api/me', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    signal: controller?.signal,
    withCredentials: true,
  });
  return response.data;
}

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  await axios.post('/base/api/me/change-password', { oldPassword, newPassword });
}

export async function unregister() {
  await axios.delete('/base/api/me');
}

// export async function getMyAccount() {
//   const response = await fetch('http://localhost:4000/api/me', {
//     method: 'GET',
//     credentials: 'include',
//   });
//   const data = await response.json();
//   return data;
// }
