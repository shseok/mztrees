"use client";

import { WriteProvider } from "@/context/WriteContext";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // layout이 client라서 server 컴포넌트인 edit> id > page에서 에러날 줄 알았는데 안난다..?
  const hasPermission = useProtectedRoute();

  if (!hasPermission) {
    // TODO: 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return <WriteProvider>{children}</WriteProvider>;
}
