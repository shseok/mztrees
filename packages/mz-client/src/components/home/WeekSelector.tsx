import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { addWeekToRange } from '~/lib/week';

interface Props {
  dateRange: string[];
}

const SERVICE_START_DATE = new Date('2023-04-01');

const WeekSelector = ({ dateRange }: Props) => {
  const [startDate, endDate] = useMemo(() => {
    const [startDate, endDate] = dateRange;
    const start = format(new Date(startDate), 'yyy년 MM월 dd일');
    const end = format(new Date(endDate), 'yyy년 MM월 dd일');
    return [start, end];
  }, [dateRange]);
  const [, setSearchParams] = useSearchParams();

  /** TODO: refactor to link */
  const onClickPrev = () => {
    const [start, end] = addWeekToRange(dateRange, -1);
    setSearchParams({ mode: 'past', start, end });
  };

  const onClickNext = () => {
    const [start, end] = addWeekToRange(dateRange, +1);
    setSearchParams({ mode: 'past', start, end });
  };

  // TODO: 끝 날짜의 00:59:59 가지의 시간으로 정정해주기(feat. 시작 날짜도 마찬가지)
  const [prevDisabled, nextDisabled] = useMemo(() => {
    const today = new Date();
    const [start, end] = dateRange.map((date) => new Date(date));
    return [start <= SERVICE_START_DATE, end >= today];
  }, [dateRange]);

  return (
    <Block>
      <DateInfo>
        {startDate} ~ {endDate}
      </DateInfo>
      <WeekNavigator>
        <TextButton onClick={onClickPrev} disabled={prevDisabled}>
          이전 주
        </TextButton>
        <TextButton onClick={onClickNext} disabled={nextDisabled}>
          다음 주
        </TextButton>
      </WeekNavigator>
    </Block>
  );
};

const Block = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
  color: ${colors.gray5};
`;

const DateInfo = styled.div``;

const WeekNavigator = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const TextButton = styled.button`
  display: inline-flex;
  font-size: inherit;
  text-decoration: underline;
  &:disabled {
    color: ${colors.gray2};
    text-decoration: none;
  }
`;

export default WeekSelector;
