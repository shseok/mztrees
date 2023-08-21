import { ImageViewerProvider } from "@/context/ImageViewerContext";
import { WriteProvider } from "@/context/WriteContext";
import { checkIsLoggedIn } from "@/lib/applyAuth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "새 글 작성",
  robots: "noindex",
};

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("pre-rendering test in write");
  const isLoggedIn = await checkIsLoggedIn();
  if (!isLoggedIn) {
    return redirect(`/login?next=/write`);
  }
  return (
    <ImageViewerProvider>
      <WriteProvider>{children}</WriteProvider>
    </ImageViewerProvider>
  );
}
