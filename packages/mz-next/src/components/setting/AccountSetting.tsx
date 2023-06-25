import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useUser } from '~/hooks/stores/userStore';
import { colors } from '~/lib/colors';
import Input from '../system/Input';
import Button from '../system/Button';
import { useDialog } from '~/context/DialogContext';
import { useMutation } from '@tanstack/react-query';
import { changePassword, unregister } from '~/lib/api/me';
import { extractNextError } from '~/lib/nextError';
import { media } from '~/lib/media';

const AccountSetting = () => {
  const user = useUser();
  if (!user) return null;
  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const reset = () => {
    setForm({
      oldPassword: '',
      newPassword: '',
    });
  };
  const { open } = useDialog();

  // 실패할 일이 있기때문에 mutation 사용
  const { mutate } = useMutation(changePassword, {
    onSuccess: () => {
      open({
        title: '비밀번호 변경 완료',
        description: '비밀번호 변경이 완료되었습니다.',
        mode: 'alert',
      });
      reset();
    },
    onError: (error) => {
      const extractedError = extractNextError(error);
      console.log(extractedError);
      if (extractedError.name === 'Forbidden') {
        open({
          title: '비밀번호 불일치',
          description: '비밀번호가 일치하지 않습니다.. 현재 비밀번호를 다시 입력해주세요.',
          mode: 'alert',
          onConfirm() {
            oldPasswordInputRef.current?.focus();
            setForm((prev) => ({ ...prev, oldPassword: '' }));
          },
        });
      } else if (extractedError.name === 'BadRequest') {
        open({
          title: '비밀번호 변경 실패',
          description: '8~20자, 영문/숫자/특수문자 1가지 이상 입력해주세요.',
          mode: 'alert',
          onConfirm() {
            newPasswordInputRef.current?.focus();
            setForm((prev) => ({ ...prev, newPassword: '' }));
          },
        });
      }
    },
  });

  // 실패할 일이 없는 탈퇴는 mutation 사용 x
  const askUnregister = () => {
    open({
      title: '계정 탈퇴',
      description: '계정에 관련된 정보를 모두 삭제합니다. 정말로 탈퇴하시겠습니까?',
      mode: 'confirm',
      confirmText: '탈퇴',
      cancelText: '취소',
      async onConfirm() {
        await unregister();
        try {
        } catch (e) {}
        window.location.href = '/';
      },
    });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <Block>
      <div>
        <Title>내 계정</Title>
        <Section>
          <h4>아이디</h4>
          <Username>{user.username} 님</Username>
        </Section>
        <Section>
          <h4>비밀번호</h4>
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Input
                value={form.oldPassword}
                name='oldPassword'
                placeholder='현재 비밀번호'
                type='password'
                onChange={onChange}
                autoComplete='off'
                ref={oldPasswordInputRef}
              />
              <Input
                value={form.newPassword}
                name='newPassword'
                placeholder='새 비밀번호'
                type='password'
                onChange={onChange}
                autoComplete='off'
                ref={newPasswordInputRef}
              />
            </InputGroup>
            <Button layoutmode='fullWidth' variant='primary' size='small' type='submit'>
              비밀번호 변경
            </Button>
          </form>
        </Section>
      </div>
      <UnregisterButton onClick={askUnregister}>계정 탈퇴</UnregisterButton>
    </Block>
  );
};
const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex: 1;
  justify-content: space-between;

  ${media.mobile} {
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
    // flex: initial;
  }
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 32px;
  font-weight: 800;
  color: ${colors.gray5};
  font-size: 36px;
  line-height: 1.5;
`;

const Section = styled.div`
  h4 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 16px;
    color: ${colors.gray3};
  }

  & + & {
    margin-top: 32px;
  }
`;

const Username = styled.div`
  font-size: 16px;
  color: ${colors.gray5};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const UnregisterButton = styled(Button)`
  font-size: 16px;
  background: ${colors.destructive};
`;

export default AccountSetting;
