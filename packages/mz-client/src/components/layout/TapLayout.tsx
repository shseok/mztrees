import React from 'react';
import FullHeightPage from '~/components/system/FullHeightPage';
import Header from '~/components/base/Header';
import Footer from '~/components/base/Footer';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const TapLayout = () => {
  return (
    <FullHeightPage>
      <Header />
      <Content>
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

export default TapLayout;
