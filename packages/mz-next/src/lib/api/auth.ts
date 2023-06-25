import { fetchClient } from "../client";
import { User } from "./types";

export async function userRegister(params: AuthParams) {
  const response = await fetchClient.post<AuthResult>(
    "/api/auth/register",
    params
  );
  return response;
}

export async function userLogin(params: AuthParams) {
  const response = await fetchClient.post<AuthResult>(
    "/api/auth/login",
    params
  );
  return response;
}

export async function userLogout() {
  await fetchClient.post("/api/auth/logout");
}

export async function refreshToken() {
  const response = await fetchClient.post<Tokens>("/api/auth/refresh", {});
  return response;
}

interface AuthParams {
  username: string;
  password: string;
}

export interface AuthResult {
  tokens: Tokens;
  user: User;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
