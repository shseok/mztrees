import { useEffect } from 'react';
import usePrivateAxios from '~/hooks/usePrivateAxios';
import { extractNextError } from './nextError';
import { setUser } from '~/hooks/stores/userStore';
import { User } from './api/types';

export function getMyAccountWithRefresh() {
  console.log('refresh');
  const privateAxios = usePrivateAxios();
  // TODO: Remove with SSR
  const set = setUser();
  useEffect(() => {
    let isMounted = true; // ?
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await privateAxios.get<User>('/api/me', {
          signal: controller.signal,
        });
        isMounted && set(response.data);
      } catch (e) {
        const extractedError = extractNextError(e);
        console.log(extractedError);
        return null;
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  /*
  try {
    const me = await getMyAccount();
    console.log('1: access 기한 내');
    return me;
  } catch (e) {
    console.log('2: access 기한 민료');
    const error = extractError(e);
    if (error.name === 'UnauthorizedError' && error.payload?.isExpiredToken) {
      try {
        console.log('3: refresh ');
        await refreshToken();
        const me = await getMyAccount();
        console.log(me);
        return me;
      } catch (innerError) {
        console.log(innerError);
        throw e;
      }
    }
    console.log(
      '4: refresh 토큰 마저 만료된 경우 or 모든 토큰이 쿠키에 없는 경우 > 로그인 페이지로',
    );
    throw e;
  }
  */
}
