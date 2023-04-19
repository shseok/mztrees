import React from 'react';
import styled from 'styled-components';
import LabelInput from '~/components/LabelInput';
import Button from '~/components/Button';
import QuestionLink from '~/components/QuestionLink';
import { SubmitHandler, useForm } from 'react-hook-form';

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
  const { usernamePlaceholder, passwordPlaceholder, question, actionLink, buttonText, actionText } =
    authDescription[mode];
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const rs = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 2000);
    });
    console.log(rs);
  };
  // console.log(watch('username')); // username이 등록된 컴포넌트에 값을 입력시 매번 확인기능

  return (
    <Block onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <LabelInput
          label='아이디'
          {...register('username', { required: true, minLength: 5, maxLength: 20 })}
          placeholder={usernamePlaceholder}
          disabled={isSubmitting}
        />
        {errors.username && <span>This field is required</span>}
        <LabelInput
          label='비밀번호'
          {...register('password', { required: true, minLength: 8, maxLength: 20 })}
          placeholder={passwordPlaceholder}
          disabled={isSubmitting}
        />
        {errors.password && <span>This field is required</span>}
      </InputGroup>

      <ActionsBox>
        <Button layoutMode='fullWidth' type='submit' disabled={isSubmitting}>
          {buttonText}
        </Button>
        <QuestionLink question={question} name={actionText} to={actionLink} />
      </ActionsBox>
    </Block>
  );
};

const Block = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex: 1;
  justify-content: space-between;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionsBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

export default AuthForm;
