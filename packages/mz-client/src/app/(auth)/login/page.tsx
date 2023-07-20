import BasicLayout from "@/components/layout/BasicLayout";
import { Suspense } from "react";
import Loading from "@/components/system/PostLoading";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "login",
  description: "mz login page",
};

export default function Login() {
  console.log("login");
  return (
    <BasicLayout
      hasBackButton={true}
      title="로그인"
      desktopHeaderVisible={false}
    >
      <Suspense fallback={<Loading />}>
        <AuthForm mode="login" />
      </Suspense>
    </BasicLayout>
  );
}
