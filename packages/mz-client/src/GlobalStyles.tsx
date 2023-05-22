import { createGlobalStyle } from 'styled-components';
// TODO: Reset CSS > https://cssdeck.com/blog/scripts/eric-meyer-reset-css/
const GlobalStyle = createGlobalStyle`
  html{
    box-sizing: border-box;
  }
  *{
    box-sizing: inherit;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    margin: 0;
  }
  button, input{
    font-family: inherit;
  }
  button {
    background: none;
    border: none;
    outline: none;
    padding: 0;
  }
`;

export default GlobalStyle;
