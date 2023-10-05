import { FetchError, _cookie } from "../client";

export async function extractUrlsWithProgress(
  link: string,
  throttleUpdateProgress: (value: number) => void
) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL!
      : process.env.NEXT_PUBLIC_API_BASE_URL!;

  const result = await fetch(`${baseUrl}/api/items/urls`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: _cookie,
    },
    body: JSON.stringify({ link }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        throw new FetchError(response, data);
      }
      if (!response?.body) return;
      // get total length
      const contentLength = response.headers.get("Content-Length");
      const reader = response.body.getReader();

      let receivedLength = 0;
      // 프로그래스 바 업데이트 또는 상태 표시
      function updateProgress({ value }: { value: number }) {
        if (contentLength !== null) {
          const percentComplete =
            parseFloat((value / parseInt(contentLength, 10)).toFixed(2)) * 100;
          throttleUpdateProgress(percentComplete);
        }
      }

      return new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              receivedLength += value.byteLength;
              updateProgress({ value: receivedLength });
              controller.enqueue(value);
              push();
            });
          }
          push();
        },
      });
    })
    .then((stream) => new Response(stream));

  const response = await result.json();
  return response;
}
