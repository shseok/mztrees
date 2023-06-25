"use client";

import React, { useMemo, useState } from "react";
import LabelInput from "@/components/system/LabelInput";
import Button from "@/components/system/Button";
import QuestionLink from "@/components/auth/QuestionLink";
import { SubmitHandler, useForm } from "react-hook-form";
import { userLogin, userRegister } from "@/lib/api/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { validate } from "@/lib/validate";
import logioIcon from "../../../public/assets/logo.svg";
import Image from "next/image";
import { setUser } from "@/hooks/stores/userStore";
import styles from "@/styles/AuthForm.module.scss";
import Link from "next/link";

interface Props {
  mode: "login" | "register";
}

const authDescription = {
  login: {
    usernamePlaceholder: "아이디를 입력하세요.",
    passwordPlaceholder: "비밀번호를 입력하세요.",
    question: "계정이 없으신가요?",
    buttonText: "로그인",
    actionText: "회원가입",
    actionLink: "/register",
  },
  register: {
    usernamePlaceholder: "5~20자 사이의 영문 소문자 숫자 입력",
    passwordPlaceholder: "8자 이상, 영문/숫자/특수문자 총 2가지 이상 입력",
    question: "계정이 이미 있으신가요?",
    buttonText: "회원가입",
    actionText: "로그인",
    actionLink: "/login",
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
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: "all",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [error, setError] = useState<AppError | undefined>();
  const [error, setError] = useState<any | undefined>();
  const set = setUser();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      if (mode === "register") {
        const result = await userRegister(data);
        set(result.user);
        router.push("/");
      } else {
        const result = await userLogin(data);
        set(result.user);
        const from = searchParams.get("next") ?? "/";
        router.replace(from);
      }
    } catch (e) {
      set(null);
      // const error = extractError(e);
      setError(error);
    }
  };
  const usernameErrorMessage = useMemo(() => {
    if (mode !== "register") return undefined;
    if (errors.username) {
      if (errors.username.type === "minLength" || "maxLength") {
        return "5~20자 사이의 글자를 입력해주세요.";
      } else if (errors.username.type === "validate") {
        return "영문 소문자 또는 숫자를 입력해주세요.";
      }
    }
    if (error?.name === "UserExistsError") {
      return "이미 존재하는 계정입니다.";
    }
    return undefined;
  }, [error, errors.username]);

  const passwordErrorMessage = useMemo(() => {
    if (mode !== "register") return undefined;
    if (errors.password) {
      if (errors.password.type === "minLength" || "maxLength") {
        return "8~20자 사이의 글자를 입력해주세요.";
      } else if (errors.password.type === "validate") {
        return "영문/숫자/특수문자 1가지 이상 입력해주세요.";
      }
    }
    return undefined;
  }, [errors.password]);

  // if (error) {
  //   return <h1>{error.message}</h1>;
  // }
  console.log(error);
  // console.log(errors.username, errors.password, errors);

  // handleSubmit > e.preventDefault() 를 기본으로 적용된다.
  return (
    <form
      className={styles.form}
      method="post"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Link className={styles.desktop_logo} href="/">
        <Image src={logioIcon} alt="logo" />
      </Link>
      <div className={styles.input_group}>
        <LabelInput
          label="아이디"
          {...register("username", {
            required: true,
            minLength: 5,
            maxLength: 20,
            validate: validate.username,
          })}
          placeholder={usernamePlaceholder}
          disabled={isSubmitting}
          errorMessage={usernameErrorMessage}
          autoComplete="on"
          // errorMessage={error?.name === 'UserExistsError' ? 'hgh': undefined}
        />
        {/*{errors.username && <span>This field is required</span>}*/}
        <LabelInput
          label="비밀번호"
          type="password"
          {...register("password", {
            required: true,
            minLength: 8,
            maxLength: 20,
            validate: validate.password,
          })}
          placeholder={passwordPlaceholder}
          disabled={isSubmitting}
          errorMessage={passwordErrorMessage}
          autoComplete="on"
        />
        {/*{errors.password && <span>This field is required</span>}*/}
      </div>

      <div className={styles.action_box}>
        {error?.name === "AuthenticationError" && (
          <div className={styles.action_error_message}>
            잘못된 계정 정보입니다.
          </div>
        )}
        <Button layoutmode="fullWidth" type="submit" disabled={isSubmitting}>
          {buttonText}
        </Button>
        <QuestionLink question={question} name={actionText} to={actionLink} />
      </div>
    </form>
  );
};

export default AuthForm;
