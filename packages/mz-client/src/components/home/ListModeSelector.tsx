import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { ListMode } from '~/lib/api/types';
import { ReactComponent as Calendar } from '~/assets/calendar.svg';
import { ReactComponent as TrendingOutline } from '~/assets/trendingOutline.svg';
import { ReactComponent as Time } from '~/assets/time.svg';
import { colors } from '~/lib/colors';

const ModeWidth = 75;
const ModeGap = 16;

interface Props {
  mode: ListMode;
  onSelectMode: (mode: ListMode) => void;
}
const ListModeSelector = ({ mode, onSelectMode }: Props) => {
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
    const gaps = currentIndex * ModeGap;
    const sizes = ModeWidth;
    return gaps + currentIndex * sizes;
  }, [currentIndex]);

  /** TODO: implements with link instead of onClick */

  return (
    <Block>
      <ModeContainer>
        {modeInfos.map((modeInfo) => (
          <ListModeItem
            {...modeInfo}
            currentMode={mode}
            onSelectMode={onSelectMode}
            key={modeInfo.name}
          />
        ))}
        <Indicator style={{ left: indicatorLeft }} />
      </ModeContainer>
    </Block>
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
    <Mode isActive={mode === currentMode} onClick={() => onSelectMode(mode)}>
      {icon}
      {name}
    </Mode>
  );
};
const Block = styled.div`
  margin: 0 auto;
  margin-bottom: 14px;
`;

const ModeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  position: relative;
`;

const Mode = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${ModeWidth}px;
  margin-bottom: 4px;
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.gray3};

  ${(props) =>
    props.isActive &&
    css`
      color: ${colors.primary};
      font-weight: 600;
    `}
  svg {
    display: block;
    width: 24px;
    height: 24px;
    margin-right: 7px;
  }
`;

const Indicator = styled.div`
  width: 75px;
  height: 3px;
  border-radius: 1px;
  background: ${colors.primary};
  position: absolute;
  left: 0;
  bottom: -5px;

  transition: left 0.2s ease-in-out;
`;

export default ListModeSelector;
