import TabLayout from "@/components/layout/TabLayout";

export const metadata = {
  title: "북마크",
  robots: "noindex",
};

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TabLayout className="layout_padding">{children}</TabLayout>;
}
