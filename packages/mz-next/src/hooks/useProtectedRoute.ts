import { useUser } from "@/context/userContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { currentUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  console.log(currentUser);
  useEffect(() => {
    if (!currentUser) {
      router.replace(`/auth/login?next=${pathname}`);
      // router.replace(`/auth/login?next=${pathname}`);
    }
  }, [currentUser, router, pathname]);
  return !!currentUser;
}
