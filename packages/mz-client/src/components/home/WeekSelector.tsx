import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { addWeekToRange } from '@/lib/week';
import styles from '@/styles/WeekSelector.module.scss';
import useSetSearchParams from '@/hooks/useSetSearchParams';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';

const SERVICE_START_DATE = new Date('2023-04-01');

const WeekSelector = () => {
  const { dateRange } = homeParameterStore(
    (state) => ({ dateRange: state.dateRange }),
    shallow
  );
  const [startDate, endDate] = useMemo(() => {
    const [startDate, endDate] = dateRange;
    const start = format(new Date(startDate), 'yyy년 MM월 dd일');
    const end = format(new Date(endDate), 'yyy년 MM월 dd일');
    return [start, end];
  }, [dateRange]);
  const setSearchParams = useSetSearchParams();
  const { mode } = useTheme();

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
    <div className={styles.block}>
      <div className={cn(styles.date_info, mode === 'dark' && styles.dark)}>
        {startDate} ~ {endDate}
      </div>
      <div className={styles.week_navigator}>
        <button
          type='button'
          aria-label='이전 주 게시글 가져오기'
          className={cn(styles.text_button, mode === 'dark' && styles.dark)}
          onClick={onClickPrev}
          disabled={prevDisabled}
        >
          이전 주
        </button>
        <button
          type='button'
          aria-label='다음 주 게시글 가져오기'
          className={cn(styles.text_button, mode === 'dark' && styles.dark)}
          onClick={onClickNext}
          disabled={nextDisabled}
        >
          다음 주
        </button>
      </div>
    </div>
  );
};

export default WeekSelector;
