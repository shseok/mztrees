'use client';

import React, { useRef, useState } from 'react';
import Input from '../system/Input';
import Button from '../system/Button';
import { useDialog } from '@/context/DialogContext';
import { unregister } from '@/lib/api/me';
import { extractNextError } from '@/lib/nextError';
import styles from '@/styles/AccountSetting.module.scss';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import { useChangePasswordMutation } from '@/hooks/mutation/useChangePasswordMutation';

const AccountSetting = () => {
  const { currentUser } = useUser();

  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const openLoginDialog = useOpenLoginDialog();
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
  const onConfirm = () => {
    oldPasswordInputRef.current?.focus();
    setForm((prev) => ({ ...prev, oldPassword: '' }));
  };
  const { open } = useDialog();
  const { mode: themeMode } = useTheme();

  // 실패할 일이 있기때문에 mutation 사용
  const mutateChangePassword = useChangePasswordMutation(reset, onConfirm);

  // 실패할 일이 없는 탈퇴는 mutation 사용 x
  const askUnregister = () => {
    open({
      title: '계정 탈퇴',
      description:
        '계정에 관련된 정보를 모두 삭제합니다. 정말로 탈퇴하시겠습니까?',
      mode: 'confirm',
      confirmText: '탈퇴',
      cancelText: '취소',
      async onConfirm() {
        try {
          await unregister();
        } catch (e) {
          const error = extractNextError(e);
          if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
            try {
              const tokens = await refreshToken();
              setClientCookie(`access_token=${tokens.accessToken}`);

              await unregister();
            } catch (innerError) {
              // expire refresh
              openLoginDialog('sessionOut');
            }
          }
          console.log(error);
        }
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
    mutateChangePassword(form);
  };

  if (!currentUser) return null;

  return (
    <div className={styles.block}>
      <div>
        <h1 className={cn(styles.title, themeMode === 'dark' && styles.dark)}>
          내 계정
        </h1>
        <div
          className={cn(styles.section, themeMode === 'dark' && styles.dark)}
        >
          <h4>아이디</h4>
          <div
            className={cn(styles.username, themeMode === 'dark' && styles.dark)}
          >
            {currentUser.username} 님
          </div>
        </div>
        <div
          className={cn(styles.section, themeMode === 'dark' && styles.dark)}
        >
          <h4>비밀번호</h4>
          <form onSubmit={onSubmit} role='form'>
            <div className={styles.input_group}>
              <Input
                type='password'
                value={form.oldPassword}
                name='oldPassword'
                placeholder='현재 비밀번호'
                onChange={onChange}
                autoComplete='off'
                ref={oldPasswordInputRef}
              />
              <Input
                type='password'
                value={form.newPassword}
                name='newPassword'
                placeholder='새 비밀번호'
                onChange={onChange}
                autoComplete='off'
                ref={newPasswordInputRef}
              />
            </div>
            <Button
              type='submit'
              aria-label='비밀번호 변경'
              layoutmode='fullWidth'
              variant='primary'
              size='small'
            >
              비밀번호 변경
            </Button>
          </form>
        </div>
      </div>
      <Button
        type='button'
        aria-label='계정 탈퇴'
        variant='warning'
        onClick={askUnregister}
      >
        계정 탈퇴
      </Button>
    </div>
  );
};

export default AccountSetting;
