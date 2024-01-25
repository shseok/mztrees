import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { SortMode, Tag, View } from '@/types/db';
import { Trending, History, Calendar } from '@/components/vectors';
import styles from '@/styles/SortModeSelector.module.scss';
import { cn } from '@/utils/common';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';

const GAP = 16;

interface Props {
  mode: SortMode;
  tag: Tag | null;
  view: View;
}
const SortModeSelector = () => {
  const { tag, mode, view } = homeParameterStore(
    (state) => ({ tag: state.tag, mode: state.mode, view: state.view }),
    shallow
  );
  const [elementSizes, setElementSizes] = useState([0, 0, 0]);
  const setElementSizeOfIndex = useCallback((index: number, size: number) => {
    setElementSizes((prev) => {
      const next = [...prev];
      next[index] = size;
      return next;
    });
  }, []);
  const modeInfos = useMemo(
    () =>
      [
        {
          mode: 'trending',
          icon: <Trending />,
          name: '트렌딩',
        },
        {
          mode: 'recent',
          icon: <History />,
          name: '최근',
        },
        {
          mode: 'past',
          icon: <Calendar />,
          name: '과거',
        },
      ] as const,
    []
  );
  const currentIndex = modeInfos.findIndex(
    (modeInfo) => modeInfo.mode === mode
  );
  const indicatorLeft = useMemo(() => {
    const gaps = currentIndex * GAP;
    const sizes = elementSizes
      .slice(0, currentIndex)
      .reduce((a, b) => a + b, 0);
    return gaps + sizes;
  }, [currentIndex, elementSizes]);

  const indicatorWidth = elementSizes[currentIndex];

  return (
    <nav className={styles.block}>
      {modeInfos.map((modeInfo, index) => (
        <ListModeItem
          currentMode={mode}
          tag={tag}
          view={view}
          key={modeInfo.name}
          index={index}
          onUpdateSize={setElementSizeOfIndex}
          {...modeInfo}
        />
      ))}
      <div
        className={styles.indicator}
        style={{ left: indicatorLeft + 0.3, width: indicatorWidth }}
      />
    </nav>
  );
};

const ListModeItem = ({
  mode,
  name,
  icon,
  tag,
  view,
  currentMode,
  onUpdateSize,
  index,
}: Props & {
  name: string;
  icon: React.ReactNode;
  currentMode: SortMode;
  index: number;
  onUpdateSize(index: number, size: number): void;
}) => {
  const { mode: themeMode } = useTheme();
  const ref = useRef<HTMLAnchorElement>(null);
  const link = tag
    ? `/?mode=${mode}&tag=${tag}&view=${view}`
    : `/?mode=${mode}&view=${view}`;

  useEffect(() => {
    if (!ref.current) return;
    onUpdateSize(index, ref.current.clientWidth);
  }, [onUpdateSize, index]);
  return (
    <Link
      className={cn(
        styles.mode,
        mode === currentMode && styles.active,
        themeMode === 'dark' && styles.dark
      )}
      href={link}
      prefetch={mode !== 'past'}
      ref={ref}
    >
      {icon}
      {name}
    </Link>
  );
};

export default SortModeSelector;
