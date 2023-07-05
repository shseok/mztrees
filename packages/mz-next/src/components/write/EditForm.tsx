"use client";

import { Item } from "@/lib/api/types";
import React, { useState } from "react";
import WriteFormTemplate from "./WriteFormTemplate";
import styles from "@/styles/EditForm.module.scss";
import LabelInput from "../system/LabelInput";
import LabelTextArea from "../system/LabelTextArea";
import { useRouter } from "next/navigation";
import { updateItem } from "@/lib/api/items";
import { extractNextError } from "@/lib/nextError";

const EditForm = ({ item }: { item: Item }) => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    body: item.body,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    const key = e.target.name as keyof typeof form;
    const { value } = e.target;
    setForm({ ...form, [key]: value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.title === "" || form.body === "") {
      setErrorMessage("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await updateItem({
        itemId: item.id,
        ...form,
      });
      // router.push(`/items/${item.id}`);
      router.back();
    } catch (error) {
      // TODO: handle error
      extractNextError(error);
      console.error(error);
    }
  };

  return (
    <WriteFormTemplate buttonText="수정하기" onSubmit={onSubmit}>
      <div className={styles.group}>
        <LabelInput
          label="제목"
          name="title"
          onChange={onChange}
          value={form.title}
        />
        <LabelTextArea
          className={styles.styled_label_textarea}
          label="내용"
          name="body"
          onChange={onChange}
          value={form.body}
        />
        {errorMessage ? (
          <div className={styles.message}>{errorMessage}</div>
        ) : null}
      </div>
    </WriteFormTemplate>
  );
};

export default EditForm;
