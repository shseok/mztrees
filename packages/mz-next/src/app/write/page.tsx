"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import LabelInput from "@/components/system/LabelInput";
import WriteFormTemplate from "@/components/write/WriteFormTemplate";
import { useWriteContext } from "@/context/WriteContext";
import { useProtectedRoute } from "@/lib/protectRoute";
import { useRouter } from "next/navigation";

export default function Write() {
  const router = useRouter();
  // const hasPermission = useProtectedRoute();

  // if (!hasPermission) {
  //   // TODO: 인가 관련 에러처리해주기 (react-tostify)
  //   return null;
  // }
  const {
    state: { form, error },
    actions,
  } = useWriteContext();

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요"
        buttonText="다음"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/write/intro");
        }}
      >
        <LabelInput
          label="url"
          placeholder="https://example.com"
          // defaultValue={state.url}
          onChange={(e) => {
            actions.change("link", e.target.value);
          }}
          value={form.link}
          errorMessage={
            error?.statusCode === 422 ? "유효하지 않은 URL입니다." : undefined
          }
        />
      </WriteFormTemplate>
    </BasicLayout>
  );
}
