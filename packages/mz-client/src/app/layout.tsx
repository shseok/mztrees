import "../styles/global.scss";
import localFont from "next/font/local";
import Providers from "@/utils/provider";
import GlobalBottomSheetModal from "@/components/system/GlobalBottomSheetModal";
import { Metadata } from "next";
import ToastProviders from "@/components/system/ToastProvider";

export const metadata: Metadata = {
  title: "엠제트리 - Mztrees, 웹 사이트 공유의 장",
  description:
    "인터넷에 흩어져있는 트렌디하거나 유용한 사이트들을 엠제트리에서 확인하고 공유해보세요.",
  metadataBase: new URL("https://img.mztrees.com"),
  openGraph: {
    images: "/og-image.png",
  },
  icons: {
    icon: ["/favicon/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
  },
  manifest: "/favicon/site.webmanifest",
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
      path: "../../public/fonts/Pretendard/Pretendard-Bold.subset.woff2",
      weight: "700",
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
  return (
    <html lang="ko" className={myFont.className}>
      <body>
        <ToastProviders>
          <Providers>{children}</Providers>
        </ToastProviders>
        <GlobalBottomSheetModal />
      </body>
    </html>
  );
}
