import localFont from "next/font/local";
import { Nanum_Gothic } from "next/font/google";

export const pretendard = localFont({
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

// The reason this font is used is because hinting is not applied to the pretendard font. (if font-size <= 15px, use this font)
export const nanum_gothic = Nanum_Gothic({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
  variable: "--font-noto-sans",
});
