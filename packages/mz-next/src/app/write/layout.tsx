import { WriteProvider } from "@/context/WriteContext";
import { checkIsLoggedIn } from "@/lib/protectRoute";
import { redirect } from "next/navigation";

export default async function Root({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await checkIsLoggedIn();
  if (!isLoggedIn) {
    redirect("/auth/login?next=/write");
  }
  console.log("write", isLoggedIn);

  return <WriteProvider>{children}</WriteProvider>;
}
