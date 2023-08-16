import React, { useMemo } from "react";
import { ListMode } from "@/types/db";
import { Trending, History, Calendar } from "@/components/vectors";
import styles from "@/styles/ListModeSelector.module.scss";
import { cn } from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

const ModeWidth = 75;
const ModeGap = 16;

interface Props {
  mode: ListMode;
}
const ListModeSelector = ({ mode }: Props) => {
  const modeInfos = useMemo(
    () =>
      [
        {
          mode: "trending",
          icon: <Trending />,
          name: "트렌딩",
        },
        {
          mode: "recent",
          icon: <History />,
          name: "최근",
        },
        {
          mode: "past",
          icon: <Calendar />,
          name: "과거",
        },
      ] as const,
    []
  );
  const currentIndex = modeInfos.findIndex(
    (modeInfo) => modeInfo.mode === mode
  );
  const indicatorLeft = useMemo(() => {
    const gaps = currentIndex * ModeGap;
    const sizes = ModeWidth;
    return gaps + currentIndex * sizes;
  }, [currentIndex]);

  /** TODO: implements with link instead of onClick */

  return (
    <div className={styles.block}>
      <div className={styles.mode_container}>
        {modeInfos.map((modeInfo) => (
          <ListModeItem currentMode={mode} key={modeInfo.name} {...modeInfo} />
        ))}
        <div className={styles.indicator} style={{ left: indicatorLeft }} />
      </div>
    </div>
  );
};

const ListModeItem = ({
  mode,
  name,
  icon,
  currentMode,
}: Props & { name: string; icon: React.ReactNode; currentMode: ListMode }) => {
  const { mode: themeMode } = useTheme();
  return (
    <Link
      className={cn(
        styles.mode,
        mode === currentMode && styles.active,
        themeMode === "dark" && styles.dark
      )}
      href={`/?mode=${mode}`}
      prefetch={mode !== "past"}
    >
      {icon}
      {name}
    </Link>
  );
};

export default ListModeSelector;
