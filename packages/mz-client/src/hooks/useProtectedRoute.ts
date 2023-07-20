import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtectedRoute() {
  const { currentUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  console.log(currentUser);
  useEffect(() => {
    console.log("bookmark", currentUser, "in useProtectedRoute");
    if (!currentUser) {
      router.replace(`/login?next=${pathname}`);
      // router.replace(`/login?next=${pathname}`);
    }
  }, [currentUser, router, pathname]);
  return !!currentUser;
}
