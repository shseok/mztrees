import { WriteProvider } from "@/context/WriteContext";

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WriteProvider>{children}</WriteProvider>;
}
