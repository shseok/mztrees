'use client';

import React, { useMemo, useState } from 'react';
import LabelInput from '@/components/system/LabelInput';
import Button from '@/components/system/Button';
import QuestionLink from '@/components/auth/QuestionLink';
import { SubmitHandler, useForm } from 'react-hook-form';
import { userLogin, userRegister } from '@/lib/api/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { validate } from '@/lib/validate';
import styles from '@/styles/AuthForm.module.scss';
import { Logo } from '@/components/vectors';
import {
  NextAppError,
  extractNextError,
  translateNextErrorMessage,
} from '@/lib/nextError';
import { useUser } from '@/context/UserContext';
import { cn } from '@/utils/common';
import { useTheme } from '@/context/ThemeContext';
import { useQueryClient } from '@tanstack/react-query';
import LoadingIndicator from '../system/LoadingIndicator';

interface Props {
  mode: 'login' | 'register';
}

const authDescription = {
  login: {
    usernamePlaceholder: '아이디를 입력하세요.',
    passwordPlaceholder: '비밀번호를 입력하세요.',
    question: '계정이 없으신가요?',
    buttonText: '로그인',
    actionText: '회원가입',
    actionLink: '/register',
  },
  register: {
    usernamePlaceholder: '5~20자 사이의 영문 소문자 숫자 입력',
    passwordPlaceholder: '8자 이상, 영문/숫자/특수문자 총 2가지 이상 입력',
    question: '계정이 이미 있으신가요?',
    buttonText: '회원가입',
    actionText: '로그인',
    actionLink: '/login',
  },
};

type Inputs = {
  username: string;
  password: string;
};

const AuthForm = ({ mode }: Props) => {
  const {
    usernamePlaceholder,
    passwordPlaceholder,
    question,
    actionLink,
    buttonText,
    actionText,
  } = authDescription[mode];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
  } = useForm<Inputs>({
    mode: 'all',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const [error, setError] = useState<NextAppError | undefined>();
  const { setCurrentUser: set } = useUser();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs, event) => {
    event?.preventDefault();
    queryClient.invalidateQueries(['Items', 'trending']);
    try {
      if (mode === 'register') {
        const result = await userRegister(data);
        set(result.user);
        router.push('/');
      } else {
        const result = await userLogin(data);
        set(result.user);
        const from = next ?? '/';
        router.replace(from);
      }

      router.refresh();
    } catch (e) {
      set(null);
      const error = extractNextError(e);
      setError(error);
    }
  };
  const getMessageForUsername = () => {
    if (mode !== 'register') return undefined;
    const usernameError = errors.username;
    if (usernameError) {
      switch (usernameError.type) {
        case 'minLength':
        case 'maxLength':
          return '5~20자 사이의 글자를 입력해주세요.';
        case 'validate':
          return '영문 소문자 또는 숫자를 입력해주세요.';
        default:
          break;
      }
    }
    if (error?.name === 'AlreadyExists') {
      return '이미 존재하는 계정입니다.';
    }
    return undefined;
  };

  const getMessageForPassword = () => {
    if (mode !== 'register') return undefined;
    const passwordError = errors.password;
    if (passwordError) {
      switch (passwordError.type) {
        case 'minLength':
        case 'maxLength':
          return '8~20자 사이의 글자를 입력해주세요.';
        case 'validate':
          return '영문/숫자/특수문자 1가지 이상 입력해주세요.';
        default:
          break;
      }
    }
    return undefined;
  };

  // for login error
  const onClick = () => {
    if (mode !== 'login') return;
    const isWrongCredentialsErorr = errors.username || errors.password;
    const err = { name: 'WrongCredentials' } as NextAppError;
    if (isWrongCredentialsErorr) {
      setError(err);
    }
  };
  const usernameErrorMessage = useMemo(
    () => (mode === 'register' ? getMessageForUsername() : undefined),
    [mode, error, errors.username, getMessageForUsername]
  );
  const passwordErrorMessage = useMemo(
    () => (mode === 'register' ? getMessageForPassword() : undefined),
    [mode, errors.password, getMessageForPassword]
  );

  const { mode: themeMode } = useTheme();

  return (
    <form
      className={styles.form}
      method='post'
      onSubmit={handleSubmit(onSubmit)}
      role='form'
    >
      <a
        className={cn(styles.desktop_logo, themeMode === 'dark' && styles.dark)}
        href='/'
      >
        <Logo />
      </a>
      <div className={styles.input_group}>
        <LabelInput
          label='아이디'
          {...register('username', {
            required: true,
            minLength: 5,
            maxLength: 20,
            validate: validate.username,
          })}
          placeholder={usernamePlaceholder}
          disabled={isSubmitting}
          errorMessage={usernameErrorMessage}
          autoComplete='on'
        />
        <LabelInput
          label='비밀번호'
          type='password'
          {...register('password', {
            required: true,
            minLength: 8,
            maxLength: 20,
            validate: validate.password,
          })}
          placeholder={passwordPlaceholder}
          disabled={isSubmitting}
          errorMessage={passwordErrorMessage}
          autoComplete='on'
        />
      </div>

      <div className={styles.actions_box}>
        {error && (
          <div className={styles.action_error_message}>
            {translateNextErrorMessage(error)}
          </div>
        )}
        <Button
          type='submit'
          aria-label='폼 제출'
          layoutmode='fullWidth'
          disabled={isSubmitting}
          onClick={onClick}
        >
          {isLoading ? <LoadingIndicator color='white' /> : buttonText}
        </Button>
        <QuestionLink
          question={question}
          name={actionText}
          to={next ? `${actionLink}/?next=${next}` : actionLink}
          mode={themeMode}
        />
      </div>
    </form>
  );
};

export default AuthForm;
