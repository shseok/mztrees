import React from 'react';
import FullHeightPage from '~/components/system/FullHeightPage';
import MobileHeader from '~/components/base/MobileHeader';
import Footer from '~/components/base/Footer';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import DesktopHeader from '../base/DesktopHeader';

interface Props {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const TabLayout = ({ className, children, header }: Props) => {
  return (
    <FullHeightPage>
      {header ?? (
        <>
          <MobileHeader />
          <DesktopHeader />
        </>
      )}
      <Content className={className}>{children ?? <Outlet />}</Content>
      <Footer />
    </FullHeightPage>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
`;

export default TabLayout;
