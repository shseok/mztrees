"use client";

import { User } from "@/lib/api/types";
import { createContext, useContext, useState } from "react";

/**
 * null: not logged in
 * undefined: UserContext.Provider not used
 */
type UserContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

type Props = {
  children: React.ReactNode;
  user: User | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children, user }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error("UserContext.Provider not used");
  }
  return user;
}
