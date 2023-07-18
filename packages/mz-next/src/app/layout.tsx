import "../styles/global.scss";
import localFont from "next/font/local";
import Providers from "@/utils/provider";
import { headers } from "next/headers";
import GlobalBottomSheetModal from "@/components/system/GlobalBottomSheetModal";

import { setClientCookie } from "@/lib/client";

export const metadata = {
  title: "mz",
  description:
    "service to share information in each region of korea made with Next.js and TypeScript",
};

const myFont = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard/Pretendard-Regular.subset.woff2",
      weight: "400",
    },
    {
      path: "../../public/fonts/Pretendard/Pretendard-Medium.subset.woff2",
      weight: "500",
    },
    {
      path: "../../public/fonts/Pretendard/Pretendard-SemiBold.subset.woff2",
      weight: "600",
    },
    {
      path: "../../public/fonts/Pretendard/Pretendard-ExtraBold.subset.woff2",
      weight: "800",
    },
  ],
  display: "swap",
});

// export const revalidate = 60; // 60초 이후 refresh > 모든 페이지 모두 ssr

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("RootLayout");

  return (
    <html lang="en" className={myFont.className}>
      <body>
        <Providers>{children}</Providers>
        <GlobalBottomSheetModal />
      </body>
    </html>
  );
}
