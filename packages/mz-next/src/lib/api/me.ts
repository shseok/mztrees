import { fetchClient } from "../client";
import { User } from "./types";

export async function getMyAccount(
  accessToken?: string,
  controller?: AbortController
) {
  try {
    const response = await fetchClient.get<User>("/api/me", {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
      signal: controller?.signal,
    });
    return response;
  } catch {
    return null;
  }
}

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  await fetchClient.post("/api/me/change-password", {
    oldPassword,
    newPassword,
  });
}

export async function unregister() {
  await fetchClient.delete("/api/me");
}

// export async function getMyAccount() {
//   const response = await fetch('http://localhost:4000/api/me', {
//     method: 'GET',
//     credentials: 'include',
//   });
//   const data = await response.json();
//   return data;
// }