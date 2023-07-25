import { WriteProvider } from "@/context/WriteContext";

export const metadata = {
  title: "새 글 작성",
  robots: "noindex",
};

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WriteProvider>{children}</WriteProvider>;
}
