import BasicLayout from "@/components/layout/BasicLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BasicLayout
      hasBackButton={true}
      title="로그인"
      desktopHeaderVisible={false}
    >
      {children}
    </BasicLayout>
  );
}
