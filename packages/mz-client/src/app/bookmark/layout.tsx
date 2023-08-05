import TabLayout from "@/components/layout/TabLayout";
import { checkIsLoggedIn } from "@/lib/applyAuth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "북마크",
  robots: "noindex",
};

export default async function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("pre-rendering test in bookmark");
  const isLoggedIn = await checkIsLoggedIn();
  if (!isLoggedIn) {
    return redirect(`/login?next=/bookmark`);
  }
  return <TabLayout className="layout_padding">{children}</TabLayout>;
}
