import { userLogout } from '@/lib/api/auth';
import { extractNextError } from '@/lib/nextError';

export function useLogout() {
  const handleLogout = async () => {
    try {
      await userLogout();
    } catch (e) {
      const result = extractNextError(e);
      console.log('logout', result);
    }
    window.location.href = '/';
  };

  return handleLogout;
}
