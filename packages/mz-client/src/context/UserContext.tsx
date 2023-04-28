// import { createContext, useContext } from 'react';
// import { User } from '~/lib/api/auth';
// /* 해당 컨텍스트에서 action이 필요하지 않을 것 같다.*/
// /*
//  * null: 로그인 x
//  * undefined: UserContext.Provider x (유저 컨텍스트를 사용하지 않았을 때)
//  * */
// export const UserContext = createContext<User | null | undefined>(null);

// export const useUser = () => {
//   const user = useContext(UserContext);
//   if (user === undefined) {
//     throw new Error('UserContext.Provider not used');
//   }
//   return user;
// };

import { ReactNode, createContext, useContext, useState } from 'react';
import { User } from '~/lib/api/auth';
/* 해당 컨텍스트에서 action이 필요하지 않을 것 같다.*/
/*
 * null: 로그인 x
 * undefined: UserContext.Provider x (유저 컨텍스트를 사용하지 않았을 때)
 * */

type UserAvailableType = User | null | undefined;

type UserContextType = {
  user: UserAvailableType;
  setUser: (user: UserAvailableType) => void;
};

const initialUserContext = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(initialUserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserAvailableType>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUserState = () => {
  const { user, setUser } = useContext(UserContext);
  if (user === undefined || !setUser) {
    throw new Error('UserContext.Provider not used');
  }
  return { user, setUser };
};

export default UserContext;
