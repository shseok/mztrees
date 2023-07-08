// import { useEffect } from 'react';
// import usePrivateAxios from '~/hooks/usePrivateAxios';
// import { extractNextError } from './nextError';
// import { setUser } from '~/hooks/stores/userStore';
import { getMyAccount } from "./api/me";
import { refreshToken } from "./api/auth";
import { User } from "./api/types";

import { extractNextError } from "./nextError";
import { cookies } from "next/headers";

// export function getMyAccountWithRefresh() {
//   console.log('refresh');
//   const privateAxios = usePrivateAxios();
//   // TODO: Remove with SSR
//   const set = setUser();
//   useEffect(() => {
//     let isMounted = true; // ?
//     const controller = new AbortController();

//     const getUsers = async () => {
//       try {
//         const response = await privateAxios.get<User>('/api/me', {
//           signal: controller.signal,
//         });
//         isMounted && set(response.data);
//       } catch (e) {
//         const extractedError = extractNextError(e);
//         console.log(extractedError);
//         return null;
//       }
//     };

//     getUsers();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, []);
async function getMyAccountWithRefresh() {
  // TODO: 왜 cookie를 전송하지 않으면 /me api를 못 건드는지 알아보기
  const cookieStore = cookies();
  const ac = cookieStore.get("access_token");
  const re = cookieStore.get("refresh_token");
  try {
    console.log("getMyAccountWithRefresh");
    const me = await getMyAccount(ac?.value);
    return me;
  } catch (e) {
    const error = extractNextError(e);
    // access token expired
    if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
      try {
        await refreshToken();
        const me = await getMyAccount(ac?.value);
        return me;
      } catch (innerError) {
        throw innerError;
      }
    }
    throw e;
  }
}

let getMyAccountPromise: Promise<User> | null = null;

export async function getMemoMyAccount() {
  if (!getMyAccountPromise) {
    getMyAccountPromise = getMyAccountWithRefresh();
  }
  return getMyAccountPromise;
}

export const checkIsLoggedIn = async () => {
  try {
    await getMemoMyAccount();
  } catch (e) {
    console.log("checkIsLoggedIn", extractNextError(e));
    return false;
  }
  return true;
};
