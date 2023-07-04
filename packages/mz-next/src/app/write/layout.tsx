import { WriteProvider } from "@/context/WriteContext";

export default function Root({ children }: { children: React.ReactNode }) {
  return <WriteProvider>{children}</WriteProvider>;
}
