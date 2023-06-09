import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import Button from '../system/Button';
import { media } from '~/lib/media';

interface Props {
  description?: string;
  children: React.ReactNode;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const WriteFormTemplate = ({ description, children, buttonText, onSubmit }: Props) => {
  return (
    <StyledForm method='POST' onSubmit={onSubmit}>
      {description && <h3>{description}</h3>}
      <Content>{children}</Content>
      <Button>{buttonText}</Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    width: 478px;
    align-self: center;
    justify-content: center;
  }

  h3 {
    color: ${colors.gray5};
    line-height: 1.5;
    font-size: 18px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 16px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    flex: initial;
    padding-bottom: 24px;
  }
`;

export default WriteFormTemplate;
