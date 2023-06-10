import { userLogout } from '~/lib/api/auth';

export function useLogout() {
  const handleLogout = async () => {
    try {
      await userLogout();
      window.location.href = '/';
    } catch (e) {}
  };

  return handleLogout;
}
