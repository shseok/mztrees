import React, { useMemo } from "react";
import { ListMode } from "@/lib/api/types";
import { Trending, Time, Calendar } from "@/utils/vectors";
import classNames from "classnames/bind";
import styles from "@/styles/ListModeSelector.module.scss";

const ModeWidth = 75;
const ModeGap = 16;

const cx = classNames.bind(styles);

interface Props {
  mode: ListMode;
  onSelectMode: (mode: ListMode) => void;
}
const ListModeSelector = ({ mode, onSelectMode }: Props) => {
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
          icon: <Time />,
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
          <ListModeItem
            {...modeInfo}
            currentMode={mode}
            onSelectMode={onSelectMode}
            key={modeInfo.name}
          />
        ))}
        <div className={styles.indicator} style={{ left: indicatorLeft }} />
      </div>
    </div>
  );
};

const ListModeItem = ({
  mode,
  onSelectMode,
  name,
  icon,
  currentMode,
}: Props & { name: string; icon: React.ReactNode; currentMode: ListMode }) => {
  return (
    <div
      className={cx("mode", mode === currentMode && "active")}
      onClick={() => onSelectMode(mode)}
    >
      {icon}
      {name}
    </div>
  );
};

export default ListModeSelector;
