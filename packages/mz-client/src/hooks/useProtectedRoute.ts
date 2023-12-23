import { useUser } from '@/context/UserContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useProtectedRoute() {
  const { currentUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!currentUser) {
      router.replace(`/login?next=${pathname}`);
      // router.replace(`/login?next=${pathname}`);
    }
  }, [currentUser, router, pathname]);
  return !!currentUser;
}
