import TabLayout from "@/components/layout/TabLayout";
import { useSetUser } from "@/hooks/stores/userStore";
import { getMyAccount } from "@/lib/api/me";
import { User } from "@/lib/api/types";
import styles from "@/styles/Home.module.scss";

// export async function getMyAccount(
//   accessToken?: string,
//   controller?: AbortController
// ) {
//   const response = await fetch("http:localhost:4000/api/me", {
//     method: "GET",
//     headers: accessToken
//       ? { Authorization: `Bearer ${accessToken}` }
//       : undefined,
//     signal: controller?.signal,
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch data");
//     return null;
//   }

//   const result = (await response.json()) as User;
//   return result;
// }

export default async function Test() {
  // const user = await getMyAccount();
  // console.log(user);

  return <div>test</div>;
}
