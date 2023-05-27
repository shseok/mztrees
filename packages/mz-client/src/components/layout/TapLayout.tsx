import React from 'react';
import FullHeightPage from '~/components/system/FullHeightPage';
import Header from '~/components/base/Header';
import Footer from '~/components/base/Footer';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const TabLayout = ({ className, children, header }: Props) => {
  return (
    <FullHeightPage>
      {header ?? <Header />}
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
