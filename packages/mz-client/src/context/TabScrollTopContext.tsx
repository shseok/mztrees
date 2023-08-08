"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";

export const TabScrollTopContext = createContext<Map<string, number> | null>(
  null
);

export function TabScrollTopContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollTopMap = useRef(new Map<string, number>()).current;
  return (
    <TabScrollTopContext.Provider value={scrollTopMap}>
      {children}
    </TabScrollTopContext.Provider>
  );
}

export function useTabScrollTop(ref: React.RefObject<HTMLElement>) {
  const context = useContext(TabScrollTopContext);
  const pathname = usePathname();
  const mountRef = useRef(false);

  if (!context) {
    throw new Error(
      "useTabScrollTop must be used within a TabScrollTopContextProvider"
    );
  }

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    const handleScroll = () => {
      context.set(pathname, current.scrollTop);
    };

    current.addEventListener("scroll", handleScroll);

    // 스크롤 위치를 이전에 저장된 위치로 설정
    current.scrollTop = context.get(pathname) ?? 0;

    return () => {
      current.removeEventListener("scroll", handleScroll);
    };
  }, [context, ref, pathname]);
}
