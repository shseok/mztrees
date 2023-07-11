"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import LabelInput from "@/components/system/LabelInput";
import LabelTextArea from "@/components/system/LabelTextArea";
import WriteFormTemplate from "@/components/write/WriteFormTemplate";
import { useWriteContext } from "@/context/WriteContext";
import { createItem } from "@/lib/api/items";
import { extractNextError } from "@/lib/nextError";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import styles from "@/styles/WriteIntro.module.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Intro() {
  const {
    state: { form },
    actions,
  } = useWriteContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = e.target.name as "title" | "body";
    const { value } = e.target;
    actions.change(key, value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.title === "" || form.body === "") {
      setErrorMessage("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // request & error
    try {
      const item = await createItem(form);
      router.push(`/items/${item.id}`);
    } catch (e) {
      const error = extractNextError(e);
      if (error.statusCode === 422) {
        router.back();
        actions.setError(error);
      }
    }
  };

  const hasPermission = useProtectedRoute();

  if (!hasPermission) {
    // TODO: 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요"
        buttonText="등록하기"
        onSubmit={onSubmit}
      >
        <div className={styles.group}>
          <LabelInput
            label="제목"
            name="title"
            value={form.title}
            onChange={onChange}
          ></LabelInput>
          <LabelTextArea
            className={styles.styeld_label_textarea}
            label="내용"
            name="body"
            value={form.body}
            onChange={onChange}
          />
          {errorMessage ? (
            <div className={styles.message}>{errorMessage}</div>
          ) : null}
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
