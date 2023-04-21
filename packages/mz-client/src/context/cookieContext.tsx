import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

export const CookieStateContext = createContext<string | null>(null);
export const CookieDispatchContext = createContext<Dispatch<SetStateAction<string>> | null>(null);

export const CookieStateProvider = ({ children }: { children: ReactNode }) => {
  const [cookie, setCookie] = useState('');

  return (
    <CookieStateContext.Provider value={cookie}>
      <CookieDispatchContext.Provider value={setCookie}>{children}</CookieDispatchContext.Provider>
    </CookieStateContext.Provider>
  );
};

export function useCookieState() {
  const state = useContext(CookieStateContext);
  if (state === null) throw new Error('Cannot find CookieProvider'); // 유효하지 않을땐 에러를 발생
  return state;
}

export function useCookieDispatch() {
  const dispatch = useContext(CookieDispatchContext);
  if (dispatch === null) throw new Error('Cannot find CookieProvider'); // 유효하지 않을땐 에러를 발생
  return dispatch;
}
