import { Metadata } from "next";

export const metadata: Metadata = {
  title: "검색",
  robots: "noindex",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
