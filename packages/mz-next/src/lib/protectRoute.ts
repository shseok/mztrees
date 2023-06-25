// import { useEffect } from 'react';
// import usePrivateAxios from '~/hooks/usePrivateAxios';
// import { extractNextError } from './nextError';
// import { setUser } from '~/hooks/stores/userStore';
// import { User } from './api/types';

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
