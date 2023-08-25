import Home from "@/components/home/Home";
import { getItems } from "@/lib/api/items";
import { getWeekRangeFromDate } from "@/lib/week";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/react-query";
import { format } from "date-fns";

// export const dynamic = "force-dynamic";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

export function generateMetadata({ searchParams }: Props) {
  const info = (() => {
    const mode = searchParams.mode;
    const canonical = {
      metadataBase: new URL("https://mztrees.com"),
      alternates: {
        canonical: "/",
      },
    };

    if (mode === "recent") {
      return {
        title: "엠제트리 - 최근 소식",
        description: "방금 엠제트리에 올라온 따끈따끈한 소식들을 확인해보세요.",
      };
    }

    if (mode === "past") {
      const { start, end } = searchParams;
      const range = getWeekRangeFromDate(new Date());
      const startDate = start ?? range?.[0];
      const endDate = end ?? range?.[1];
      const formattedStart = format(new Date(startDate), "yyyy년 MM월 dd일");
      const formattedEnd = format(new Date(endDate), "yyyy년 MM월 dd일");
      return {
        title: `엠제트리 - 과거 뉴스 (${formattedStart} ~ ${formattedEnd})`,
        description: `${formattedStart} ~ ${formattedEnd}에 올라온 엠제트리 소식들을 인기순으로 확인해보세요.`,
      };
    }

    return {
      title: "엠제트리 - 하나로 연결된 지역소식",
      description:
        "각 지역의 축제, 맛집, 사회문제 관련 다양한 소식들을 엠제트리에서 확인하고 공유해보세요.",
      ...(mode === "trending" ? canonical : {}),
    };
  })();

  return {
    ...info,
    openGraph: {
      title: info.title,
      description: info.description,
      images: "https://img.mztrees.com/og-image.png",
    },
    twitter: {
      card: "summary_large_image",
      title: info.title,
      description: info.description,
      creator: "@mztrees",
      images: "https://img.mztrees.com/og-image.png",
    },
  };

  // TODO: og - title, description, image
}
// export const metadata = {
//   title: "엠제트리 - 하나로 연결된 지역소식",
//   description: "test",
// };

export default async function Hydation() {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  await queryClient.prefetchInfiniteQuery(["items"], () =>
    getItems({ mode: "trending", region: "all" })
  );
  return (
    <Hydrate state={dehydratedState}>
      <Home />
    </Hydrate>
  );
}
