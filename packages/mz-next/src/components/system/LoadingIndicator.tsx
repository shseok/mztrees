import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as Spinner } from '~/assets/spinner.svg';
import { colors } from '~/lib/colors';

const LoadingIndicator = () => {
  return <StyledSpinner />;
};

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled(Spinner)`
  width: 24px;
  height: 24px;
  animation: ${spin} 0.5s linear infinite;
  color: ${colors.gray3};
`;

export default LoadingIndicator;
