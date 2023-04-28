import React from 'react';
import { Outlet } from 'react-router-dom';
import { WriteProvider } from '~/context/WriteContext';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';

const Write = () => {
  const hasPermission = useProtectedRoute();
  if (!hasPermission) {
    // 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return (
    <WriteProvider>
      <Outlet />
    </WriteProvider>
  );
};

export default Write;
