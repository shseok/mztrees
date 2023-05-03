import React from 'react';
import FullHeightPage from '~/components/system/FullHeightPage';
import Header from '~/components/base/Header';
import Footer from '~/components/base/Footer';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  className?: string;
}

const TabLayout = ({ className }: Props) => {
  console.log(className);
  return (
    <FullHeightPage>
      <Header />
      <Content className={className}>
        <Outlet />
      </Content>
      <Footer />
    </FullHeightPage>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default TabLayout;
