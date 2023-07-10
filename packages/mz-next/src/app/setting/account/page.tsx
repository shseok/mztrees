"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import AccountSetting from "@/components/setting/AccountSetting";
import { useProtectedRoute } from "@/lib/protectRoute";

export default function Account() {
  const hasPermission = useProtectedRoute();
  if (!hasPermission) {
    // TODO: 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return (
    <BasicLayout title="내 계정" hasBackButton>
      <AccountSetting />
    </BasicLayout>
  );
}
