import { headers } from "next/headers";
import { setClientCookie } from "./client";
import { getMyAccountWithRefresh } from "./protectRoute";
import { extractNextError } from "./nextError";

export function applyAuth() {
  const headersList = headers();
  const cookie = headersList.get("Cookie");
  if (!cookie || !cookie.includes("access_token")) {
    return false;
  }
  setClientCookie(cookie);
  return true;
}

export const checkIsLoggedIn = async () => {
  const applied = applyAuth();
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
