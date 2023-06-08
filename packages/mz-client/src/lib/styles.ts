import { FlattenSimpleInterpolation, css } from 'styled-components';

/** 데스크탑에서 hover했고 버튼이 disabled되지 않았을 때 적용이 되는 css */
export const hover = (styles: string | FlattenSimpleInterpolation) => css`
  @media (hover: hover) {
    &:hover:not(:disabled) {
      ${styles}
    }
  }
`;
