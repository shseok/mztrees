import React from 'react';
import { Outlet } from 'react-router-dom';
import TabLayout from '~/components/layout/TabLayout';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';

const Setting = () => {
  const hasPermission = useProtectedRoute();
  if (!hasPermission) {
    // 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return (
    <TabLayout>
      <Outlet />
    </TabLayout>
  );
};

export default Setting;
