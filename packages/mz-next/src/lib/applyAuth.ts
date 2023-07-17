import { headers } from "next/headers";
import { setClientCookie } from "./client";
import { getMyAccountWithRefresh } from "./protectRoute";
import { extractNextError } from "./nextError";
import type { NextRequest } from "next/server";

export function applyAuth(request: NextRequest) {
  const cookie = request.headers.get("Cookie");
  console.log(cookie, "in applyAuth");
  if (!cookie || !cookie.includes("access_token")) {
    return false;
  }
  setClientCookie(cookie);
  return true;
}

export const checkIsLoggedIn = async (request: NextRequest) => {
  const applied = applyAuth(request);
  if (!applied) return false;

  try {
    await getMyAccountWithRefresh();
  } catch (e) {
    console.log("checkIsLoggedIn", extractNextError(e));
    return false;
  }
  return true;
};

export async function getAccount() {
  const headersList = headers();
  const cookie = headersList.get("Cookie");
  if (!cookie) return null;
  setClientCookie(cookie);
  try {
    return await getMyAccountWithRefresh();
    // return await getMyAccount();
  } catch (e) {
    console.log(extractNextError(e));
    return null;
  }
}
