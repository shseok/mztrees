import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkIsLoggedIn } from "./lib/applyAuth";

export async function middleware(req: NextRequest) {
  // const token = await getToken({ req });
  // console.log(
  //   "in middleware",
  //   token,
  //   req.nextUrl,
  //   new URL("/sign-in", req.nextUrl)
  // );

  // qs때문에 실행 안되는 이슈 > client.ts 에서 qs.stringify 대체
  const isLoggedIn = await checkIsLoggedIn(req);
  console.log(isLoggedIn, "in middleware");

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: ["/dir/:path*/submit", "/dir/create"],
  matcher: ["/setting", "/write", "/bookmark"],
};
