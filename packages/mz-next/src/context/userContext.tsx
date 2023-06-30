"use client";

import { User } from "@/lib/api/types";
import { createContext, useContext, useState } from "react";

/**
 * null: not logged in
 * undefined: UserContext.Provider not used
 */
export const UserContext = createContext<User | null>(null);
interface Props {
  children: React.ReactNode;
  user: User | null;
}

export function UserProvider({ children, user }: Props) {
  // const [currentUser] = useState(user);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error("UserContext.Provider not used");
  }
  return user;
}
