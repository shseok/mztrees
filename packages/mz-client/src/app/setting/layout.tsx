import { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정",
  robots: "noindex",
};

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
