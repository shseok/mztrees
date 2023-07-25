import BasicLayout from "@/components/layout/BasicLayout";
import { Suspense } from "react";
import Loading from "@/components/system/PostLoading";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "회원가입",
  robots: "noindex",
};

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
