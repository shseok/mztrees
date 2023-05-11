import React from 'react';
import FullHeightPage from '~/components/system/FullHeightPage';
import { useGoBack } from '~/hooks/useGoback';
import styled from 'styled-components';
import HeaderBackButton from '~/components/base/HeaderBackButton';
import Header from '~/components/base/Header';

interface Props {
  hasBackButton: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onGoback?(): void;
}

const BasicLayout = ({ hasBackButton, title, children, onGoback }: Props) => {
  const goBack = useGoBack();

  return (
    <FullHeightPage>
      <Content>
        <Header
          title={title}
          headerLeft={hasBackButton ? <HeaderBackButton onClick={onGoback ?? goBack} /> : undefined}
        />
        {children}
      </Content>
    </FullHeightPage>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default BasicLayout;
