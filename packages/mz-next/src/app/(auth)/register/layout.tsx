import BasicLayout from "@/components/layout/BasicLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  <BasicLayout
    hasBackButton={true}
    title="회원가입"
    desktopHeaderVisible={false}
  >
    {children}
  </BasicLayout>;
}
