// "use client";
// 일단 보류
// 페이지 새로고침, 이동시에 me 데이터를 업데이트 시켜주는 로직이 필요할 것 같은데...
import { create } from "zustand";
import { User } from "@/lib/api/types";

type UserAvailableType = User | null | undefined;

interface userStore {
  user: UserAvailableType;
  set: (user: UserAvailableType) => void;
}

export const useUserStore = create<userStore>((set) => ({
  user: null,
  set: (user) => set((state) => ({ ...state, user })),
}));

export const useUser = () => {
  return useUserStore((state) => state.user);
};
export const useSetUser = () => {
  return useUserStore((state) => state.set);
};
