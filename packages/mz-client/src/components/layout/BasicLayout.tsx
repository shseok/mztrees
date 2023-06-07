import React from 'react';
import FullHeightPage from '~/components/system/FullHeightPage';
import { useGoBack } from '~/hooks/useGoback';
import styled from 'styled-components';
import HeaderBackButton from '~/components/base/HeaderBackButton';
import Header from '~/components/base/MobileHeader';

interface Props {
  hasBackButton: boolean;
  headerRight?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onGoback?(): void;
}

const BasicLayout = ({ hasBackButton, headerRight, title, children, onGoback }: Props) => {
  const goBack = useGoBack();

  return (
    <FullHeightPage>
      <Header
        title={title}
        headerLeft={hasBackButton ? <HeaderBackButton onClick={onGoback ?? goBack} /> : undefined}
        headerRight={headerRight}
      />
      <Content>{children}</Content>
    </FullHeightPage>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: scroll;
`;

export default BasicLayout;
