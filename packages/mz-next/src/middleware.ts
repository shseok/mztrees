import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkIsLoggedIn } from "./lib/applyAuth";

export async function middleware(req: NextRequest) {
  // const token = await getToken({ req });

  /** 현재 화면에 config.matcher에 해당하는 곳이 있다면 middleware 실행 (모바일에서만 보이므로 모바일에서 3번실행)
   *  > home 새로고침시 쿠키에 refresh token 존재 ? 3번 실행
   *  > 결국, rotation 불일치...
   *  > 다시 로그인
   *  서버에서 rotation 로직을 nextjs를 위해 없애야 하거나 access token 기간을 느리거나 택
   * */
  const isLoggedIn = await checkIsLoggedIn(req);
  console.log(isLoggedIn, "in middleware");

  if (!isLoggedIn) {
    // 서버에서 redirect한 것이므로 from home to write(client) > from login to write(server) > from write to back(client) > home
    return NextResponse.redirect(
      new URL(`/login?next=${req.nextUrl.pathname}`, req.nextUrl)
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: ["/dir/:path*/submit", "/dir/create"],
  matcher: ["/setting/:path*", "/write/:path*", "/bookmark"],
};
