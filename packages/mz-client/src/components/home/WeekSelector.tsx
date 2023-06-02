import { format } from 'date-fns';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';

interface Props {
  dateRange: string[];
}

const WeekSelector = ({ dateRange }: Props) => {
  const [startDate, endDate] = useMemo(() => {
    const [startDate, endDate] = dateRange;
    const start = format(new Date(startDate), 'yyy년 MM월 dd일');
    const end = format(new Date(endDate), 'yyy년 MM월 dd일');
    return [start, end];
  }, [dateRange]);
  return (
    <Block>
      <DateInfo>
        {startDate} ~ {endDate}
      </DateInfo>
      <WeekNavigator>
        <TextButton>이전 주</TextButton>
        <TextButton disabled>다음 주</TextButton>
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
