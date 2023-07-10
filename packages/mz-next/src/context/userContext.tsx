"use client";

import { User } from "@/lib/api/types";
import { extractNextError } from "@/lib/nextError";
import { getMyAccountWithRefresh } from "@/lib/protectRoute";
import { createContext, useContext, useEffect, useState } from "react";

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
  // user: User | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// TODO: user를 받아오지 않아서 새로고침시 확실히 유저를 입히는데 부자연스러운게 있다.
export function UserProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // user update?
  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getMyAccountWithRefresh();
        setCurrentUser(user);
      } catch (e) {
        console.log("in desktopheader", extractNextError(e));
        setCurrentUser(null);
      }
    }
    console.log("component mount"); // refresh
    // TODO: cookie가 없다면 못하도록... 하고 싶다
    fetchUserData();
  }, []);
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
