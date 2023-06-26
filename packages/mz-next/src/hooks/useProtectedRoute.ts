// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { User } from '~/lib/api/types';
// import { extractNextError } from '~/lib/nextError';
// import usePrivateAxios from './usePrivateAxios';

// export const useProtectedRoute = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const privateAxios = usePrivateAxios();

//   useEffect(() => {
//     let isMounted = true; // ?
//     const controller = new AbortController();

//     const getUsers = async () => {
//       try {
//         const response = await privateAxios.get<User>('/api/me', {
//           signal: controller.signal,
//         });
//         isMounted && setUser(response.data);
//       } catch (e) {
//         const extractedError = extractNextError(e);
//         console.log(extractedError);
//         navigate('/login', { state: { from: location, redirect: '/' }, replace: true });
//       }
//     };

//     getUsers();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, [navigate]);

//   return !!user;
// };
