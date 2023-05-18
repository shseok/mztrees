import React from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import Button from './Button';

interface Props {
  visible: boolean;
  title: string;
  description: string;
  confirmText: string;
  onClose(): void;
  onConfirm(): void;
  mode?: 'alert' | 'confirm';
}

const Dialog = ({
  visible,
  title,
  description,
  onClose,
  onConfirm,
  confirmText,
  mode = 'alert',
}: Props) => {
  return (
    <StyledModal visible={visible}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Footer>
        {mode === 'confirm' && (
          <Button onClick={onClose} variant='secondary'>
            닫기
          </Button>
        )}
        <Button onClick={onConfirm}>{confirmText}</Button>
      </Footer>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  width: 375px;
  max-width: calc(100vw - 32px);
  padding: 24px 16px 24px 16px;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.5;
  color: ${colors.gray5};
`;
const Description = styled.p`
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.gray5};
`;

const Footer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`;

export default Dialog;
