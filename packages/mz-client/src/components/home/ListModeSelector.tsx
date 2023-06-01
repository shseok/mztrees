import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { ListMode } from '~/lib/api/types';
import { ReactComponent as Calendar } from '~/assets/calendar.svg';
import { ReactComponent as TrendingOutline } from '~/assets/trendingOutline.svg';
import { ReactComponent as Time } from '~/assets/time.svg';
import { colors } from '~/lib/colors';
import { motion } from 'framer-motion';

interface Props {
  mode: ListMode;
  onSelectMode: (mode: ListMode) => void;
}
const ListModeSelector = ({ mode, onSelectMode }: Props) => {
  const [elementSizes, setElementSizes] = useState([0, 0, 0]);
  // useCallback을 안쓰면 무한 리렌더링
  const setElementSizesOfIndex = useCallback((index: number, size: number) => {
    // 비정상적인 로직
    // const newSizes = [...elementSizes];
    // newSizes[index] = size;
    // console.log(newSizes);
    // setElementSizes(newSizes);

    // 정상적인 로직
    console.log(elementSizes);
    setElementSizes((prev) => {
      const newSizes = [...prev];
      newSizes[index] = size;
      return newSizes;
    });
  }, []);
  const modeInfos = useMemo(
    () =>
      [
        {
          mode: 'trending',
          icon: <TrendingOutline />,
          name: '트렌딩',
        },
        {
          mode: 'recent',
          icon: <Time />,
          name: '최근',
        },
        {
          mode: 'past',
          icon: <Calendar />,
          name: '과거',
        },
      ] as const,
    [],
  );
  const currentIndex = modeInfos.findIndex((modeInfo) => modeInfo.mode === mode);
  const indicatorLeft = useMemo(() => {
    const gaps = currentIndex * 16;
    const sizes = elementSizes.slice(0, currentIndex).reduce((a, b) => a + b, 0);
    return gaps + sizes;
  }, [currentIndex, elementSizes]);
  const indicatorWidth = elementSizes[currentIndex];
  console.log(elementSizes);

  return (
    <Block>
      {modeInfos.map((modeInfo, index) => (
        <ListModeItem
          {...modeInfo}
          currentMode={mode}
          onSelectMode={onSelectMode}
          key={modeInfo.name}
          onUpdateSize={setElementSizesOfIndex}
          index={index}
        />
      ))}
      {indicatorWidth === 0 ? null : (
        <Indicator layout style={{ width: indicatorWidth, left: indicatorLeft }} />
      )}
    </Block>
  );
};

const ListModeItem = ({
  mode,
  onSelectMode,
  name,
  icon,
  currentMode,
  index,
  onUpdateSize,
}: Props & {
  name: string;
  icon: React.ReactNode;
  currentMode: ListMode;
  index: number;
  onUpdateSize: (index: number, size: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    console.log('effect');
    onUpdateSize(index, ref.current.clientWidth);
  }, [onUpdateSize, index]);

  return (
    <Mode isActive={mode === currentMode} onClick={() => onSelectMode(mode)} ref={ref}>
      {icon}
      {name}
    </Mode>
  );
};
const Block = styled.div`
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
  position: relative;
`;

const Mode = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  color: ${colors.gray3};
  svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  line-height: 1.5;
  font-size: 16px;

  ${(props) =>
    props.isActive &&
    css`
      color: ${colors.primary};
      font-weight: 600;
    `}
`;

const Indicator = styled(motion.div)`
  height: 2px;
  background: ${colors.primary};
  position: absolute;
  left: 0;
  bottom: -8px;
  border-radius: 1px;
`;

export default ListModeSelector;
