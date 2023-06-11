import React, { useRef } from 'react';
import styled from 'styled-components';
import { useUser } from '~/hooks/stores/userStore';
import { colors } from '~/lib/colors';
import Input from '../system/Input';
import Button from '../system/Button';
import { useDialog } from '~/context/DialogContext';
import { useMutation } from '@tanstack/react-query';
import { changePassword, unregister } from '~/lib/api/me';
import { extractNextError } from '~/lib/nextError';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  oldPassword: string;
  newPassword: string;
};

const AccountSetting = () => {
  const user = useUser();
  if (!user) return null;
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Inputs>({
    mode: 'all',
  });

  const { open } = useDialog();

  // 실패할 일이 있기때문에 mutation 사용
  const { mutate } = useMutation(changePassword, {
    onSuccess: () => {
      open({
        title: '비밀번호 변경 완료',
        description: '비밀번호 변경이 완료되었습니다.',
        mode: 'alert',
      });
    },
    onError: (error) => {
      const extractedError = extractNextError(error);
      console.log(extractedError);
      if (extractedError.name === 'Forbidden') {
        console.log();
        open({
          title: '비밀번호 불일치',
          description: '비밀번호가 일치하지 않습니다.. 현재 비밀번호를 다시 입력해주세요.',
          mode: 'alert',
          onConfirm() {
            firstInputRef.current?.focus();
          },
        });
      } else if (extractedError.name === 'BadRequest') {
        open({
          title: '비밀번호 변경 실패',
          description: '8~20자, 영문/숫자/특수문자 1가지 이상 입력해주세요.',
          mode: 'alert',
          onConfirm() {
            secondInputRef.current?.focus();
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

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    console.log(data);
    mutate(data);
  };

  return (
    <Block>
      <div>
        <Section>
          <h4>아이디</h4>
          <Username>{user.username} 님</Username>
        </Section>
        <Section>
          <h4>비밀번호</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Input
                {...register('oldPassword')}
                type='password'
                placeholder='현재 비밀번호'
                autoComplete='off'
                // ref={firstInputRef} > ref 적용하면 data undefined...
                disabled={isSubmitting}
              />
              <Input
                {...register('newPassword')}
                type='password'
                placeholder='새 비밀번호'
                autoComplete='off'
                // ref={secondInputRef}
                disabled={isSubmitting}
              />
            </InputGroup>
            <Button
              layoutmode='fullWidth'
              variant='primary'
              size='small'
              type='submit'
              disabled={isSubmitting}
            >
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
