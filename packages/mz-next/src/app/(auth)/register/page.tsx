import BasicLayout from "@/components/layout/BasicLayout";
import { Suspense } from "react";
import Loading from "@/components/base/PostLoading";
import AuthForm from "@/components/auth/AuthForm";

export default function Register() {
  console.log("register");
  return (
    <BasicLayout
      hasBackButton={true}
      title="회원가입"
      desktopHeaderVisible={false}
    >
      <Suspense fallback={<Loading />}>
        <AuthForm mode="register" />
      </Suspense>
    </BasicLayout>
  );
}
