import BasicLayout from "@/components/layout/BasicLayout";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BasicLayout
      hasBackButton={true}
      title="회원가입"
      desktopHeaderVisible={false}
    >
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </BasicLayout>
  );
}
