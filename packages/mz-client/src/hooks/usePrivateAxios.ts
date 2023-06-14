import { privateAxios } from '~/lib/api/axios';
import useRefreshToken from './useRefreshToken';
import { useEffect } from 'react';
// change nextError
import { extractError } from '~/lib/error';

const usePrivateAxios = () => {
  const refresh = useRefreshToken();
  useEffect(() => {
    const responseIntercept = privateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        const extractedError = extractError(error);
        console.log(prevRequest.error, error, extractedError);
        if (
          extractedError.name === 'UnauthorizedError' &&
          extractedError.payload?.isExpiredToken &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return privateAxios(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      privateAxios.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return privateAxios;
};

export default usePrivateAxios;
