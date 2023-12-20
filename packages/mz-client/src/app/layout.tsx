import "../styles/global.scss";
import Providers from "@/utils/provider";
import GlobalBottomSheetModal from "@/components/system/GlobalBottomSheetModal";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { colors } from "@/lib/colors";
import { pretendard } from "@/lib/fonts";

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

// export const revalidate = 60; // 60초 이후 refresh > 모든 페이지 모두 ssr

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body>
        <NextTopLoader
          color={colors.primary}
          showSpinner={false}
          shadow={false}
        />
        <Providers>{children}</Providers>
        <GlobalBottomSheetModal />
      </body>
    </html>
  );
}
