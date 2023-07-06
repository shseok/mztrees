"use client";

import React, { useRef, useState } from "react";
import Input from "../system/Input";
import Button from "../system/Button";
import { useDialog } from "@/context/DialogContext";
import { useMutation } from "@tanstack/react-query";
import { changePassword, unregister } from "@/lib/api/me";
import { extractNextError } from "@/lib/nextError";
import styles from "@/styles/AccountSetting.module.scss";
import { useUser } from "@/context/userContext";

const AccountSetting = () => {
  const { currentUser } = useUser();

  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const reset = () => {
    setForm({
      oldPassword: "",
      newPassword: "",
    });
  };
  const { open } = useDialog();

  // 실패할 일이 있기때문에 mutation 사용
  const { mutate } = useMutation(changePassword, {
    onSuccess: () => {
      open({
        title: "비밀번호 변경 완료",
        description: "비밀번호 변경이 완료되었습니다.",
        mode: "alert",
      });
      reset();
    },
    onError: (error) => {
      const extractedError = extractNextError(error);
      console.log(extractedError);
      if (extractedError.name === "Forbidden") {
        open({
          title: "비밀번호 불일치",
          description:
            "비밀번호가 일치하지 않습니다.. 현재 비밀번호를 다시 입력해주세요.",
          mode: "alert",
          onConfirm() {
            oldPasswordInputRef.current?.focus();
            setForm((prev) => ({ ...prev, oldPassword: "" }));
          },
        });
      } else if (extractedError.name === "BadRequest") {
        open({
          title: "비밀번호 변경 실패",
          description: "8~20자, 영문/숫자/특수문자 1가지 이상 입력해주세요.",
          mode: "alert",
          onConfirm() {
            newPasswordInputRef.current?.focus();
            setForm((prev) => ({ ...prev, newPassword: "" }));
          },
        });
      }
    },
  });

  // 실패할 일이 없는 탈퇴는 mutation 사용 x
  const askUnregister = () => {
    open({
      title: "계정 탈퇴",
      description:
        "계정에 관련된 정보를 모두 삭제합니다. 정말로 탈퇴하시겠습니까?",
      mode: "confirm",
      confirmText: "탈퇴",
      cancelText: "취소",
      async onConfirm() {
        await unregister();
        try {
        } catch (e) {}
        window.location.href = "/";
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

  if (!currentUser) return null;

  return (
    <div className={styles.block}>
      <div>
        <h1 className={styles.title}>내 계정</h1>
        <div className={styles.section}>
          <h4>아이디</h4>
          <div className={styles.username}>{currentUser.username} 님</div>
        </div>
        <div className={styles.section}>
          <h4>비밀번호</h4>
          <form onSubmit={onSubmit}>
            <div className={styles.input_group}>
              <Input
                value={form.oldPassword}
                name="oldPassword"
                placeholder="현재 비밀번호"
                type="password"
                onChange={onChange}
                autoComplete="off"
                ref={oldPasswordInputRef}
              />
              <Input
                value={form.newPassword}
                name="newPassword"
                placeholder="새 비밀번호"
                type="password"
                onChange={onChange}
                autoComplete="off"
                ref={newPasswordInputRef}
              />
            </div>
            <Button
              layoutmode="fullWidth"
              variant="primary"
              size="small"
              type="submit"
            >
              비밀번호 변경
            </Button>
          </form>
        </div>
      </div>
      <Button variant="warning" onClick={askUnregister}>
        계정 탈퇴
      </Button>
    </div>
  );
};

export default AccountSetting;
