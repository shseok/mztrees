import AuthForm from "@/components/auth/AuthForm";
import { cookies } from "next/headers";

export default function Login() {
  console.log("login");
  return <AuthForm mode="login" />;
}
