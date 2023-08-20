"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import LabelInput from "@/components/system/LabelInput";
import WriteFormTemplate from "@/components/write/WriteFormTemplate";
import { useWriteContext } from "@/context/WriteContext";
import { getImageUrl } from "@/lib/api/items";
import { extractNextError } from "@/lib/nextError";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Write() {
  const router = useRouter();
  const {
    state: { form, error },
    actions,
  } = useWriteContext();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요"
        buttonText="다음"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          try {
            // TODO: 만약 이전의 url에서 변경되지 않는 다면 해당 작업을 건너뛰기
            const { urls } = await getImageUrl(form.link);
            actions.change("thumbnail", { extracted: urls, selected: "" });
            router.push("/write/extract");
          } catch (e) {
            const error = extractNextError(e);
            if (error.statusCode === 422) {
              router.refresh();
              actions.setError(error);
            }
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        }}
        isLoading={isLoading}
      >
        <LabelInput
          label="url"
          placeholder="https://example.com"
          // defaultValue={state.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            actions.change("link", e.target.value);
          }}
          value={form.link}
        />
      </WriteFormTemplate>
    </BasicLayout>
  );
}
