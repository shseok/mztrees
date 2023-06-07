import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import TabLayout from '~/components/layout/TabLayout';
import { useProtectedRoute } from '~/hooks/useProtectedRoute';

const BookMarks = () => {
  const hasPermission = useProtectedRoute();
  if (!hasPermission) {
    // 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return (
    <StyledTabLayout>
      <Outlet />
    </StyledTabLayout>
  );
};

const StyledTabLayout = styled(TabLayout)`
  padding: 16px 16px 16px 16px;
`;

export default BookMarks;
