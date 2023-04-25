import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// // 이게 왜 필요한건가????
// export function setClientCookie(cookie: string) {
//   client.defaults.headers.common['Cookie'] = cookie;
// }

// export function clearClientCookie() {
//   delete client.defaults.headers.common['Cookie'];
// }
