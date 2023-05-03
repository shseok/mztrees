import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
// fullheight 트리거용(로그인 / 회원가입...)

const GlobalFullHeight = createGlobalStyle`
html, body, #root, .app{
  height: 100%
}`;

interface Props {
  children: React.ReactNode;
}

const FullHeightPage = ({ children }: Props) => {
  return (
    <>
      <Page>{children}</Page>
      <GlobalFullHeight />
    </>
  );
};

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default FullHeightPage;
