"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import React, { useEffect, useState } from "react";
import styles from "@/styles/EditForm.module.scss";
import { usePathname, useRouter } from "next/navigation";
import { getItem, updateItem } from "@/lib/api/items";
import { extractNextError } from "@/lib/nextError";
import { refreshToken } from "@/lib/api/auth";
import { setClientCookie } from "@/lib/client";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import WriteFormTemplate from "@/components/write/WriteFormTemplate";
import LabelInput from "@/components/system/LabelInput";
import LabelTextArea from "@/components/system/LabelTextArea";
import { useDialog } from "@/context/DialogContext";

type Params = {
  params: {
    id: string;
  };
};

export default function Edit({ params: { id } }: Params) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const openLoginDialog = useOpenLoginDialog();

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
        itemId: parseInt(id),
        ...form,
      });
      // router.push(`/items/${item.id}`);
      router.back();
    } catch (e) {
      // TODO: refactor erorr like "getMyAccountWithRefresh"
      const error = extractNextError(e);
      // access token expired
      if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          console.log("request refresh api", tokens.accessToken);
          setClientCookie(`access_token=${tokens.accessToken}`);

          await updateItem({
            itemId: parseInt(id),
            ...form,
          });
          router.back();
        } catch (innerError) {
          openLoginDialog("edit");
        }
      } else {
        openLoginDialog("edit");
      }
      console.log(extractNextError(e));
    }
  };

  useEffect(() => {
    async function fetchItemData() {
      try {
        const { title, body } = await getItem(parseInt(id));
        setForm({ title, body });
      } catch (e) {
        console.log(extractNextError(e));
      }
    }
    fetchItemData();
  }, []);

  return (
    <BasicLayout title="수정" hasBackButton>
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
    </BasicLayout>
  );
}

/**
 * 
 * const result = await fetch(`http://localhost:4000/api/items/${id}`, {
    cache: "no-store",
  });

  or 

  export const revalidate = 0;
  을 해도 수정하고 다시 들어오면 캐시가 된다.. 그래서 그냥 client component로 변경
 */
