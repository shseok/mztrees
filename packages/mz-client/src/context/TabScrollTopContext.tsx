'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef } from 'react';

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
  const mountedRef = useRef(false);

  if (!context) {
    throw new Error(
      'useTabScrollTop must be used within a TabScrollTopContextProvider'
    );
  }

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    const handleScroll = () => {
      context.set(pathname, current.scrollTop);
    };

    current.addEventListener('scroll', handleScroll);

    return () => {
      current.removeEventListener('scroll', handleScroll);
    };
  }, [context, ref, pathname]);

  // 컴포넌트가 처음 마운트될 때만 초기 스크롤 위치를 설정하고, 그 이후에는 해당 작업을 수행하지 않도록 하는 패턴 (twice > once)
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (ref.current) {
      ref.current.scrollTop = context.get(pathname) ?? 0;
    }
  }, [pathname, context, ref]);
}
