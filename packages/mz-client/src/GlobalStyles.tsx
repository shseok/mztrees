import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  
  html, body, #root, .app {
    height: 100%;
  }
`;

export default GlobalStyle;
