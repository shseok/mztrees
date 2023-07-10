"use client";

import { getMyAccount } from "./api/me";
import { refreshToken } from "./api/auth";
import { extractNextError } from "./nextError";
import { setClientCookie } from "./client";
import { useUser } from "@/context/userContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export async function getMyAccountWithRefresh() {
  // TODO: 왜 cookie를 전송하지 않으면 /me api를 못 건드는지 알아보기 > fetch는 브라우저 api이기 때문> Cookie 설정

  try {
    console.log("getMyAccountWithRefresh");
    const me = await getMyAccount();
    return me;
  } catch (e) {
    const error = extractNextError(e);
    // access token expired
    if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
      try {
        const tokens = await refreshToken();
        console.log("request refresh api", tokens.accessToken);
        setClientCookie(`access_token=${tokens.accessToken}`);
        const me = await getMyAccount();
        return me;
      } catch (innerError) {
        throw innerError;
      }
    }
    throw e;
  }
}

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
