import { format } from 'date-fns';

// 입력 날짜가 포함된 주의 시작 날짜와 끝 날짜를 나타내는 배열을 반환
export function getWeekRangeFromDate(d: Date) {
  const day = d.getDay();
  const startDate = d.getDate() - day;

  const start = format(
    new Date(d.getFullYear(), d.getMonth(), startDate),
    'yyyy-MM-dd'
  );
  const end = format(
    new Date(d.getFullYear(), d.getMonth(), startDate + 6),
    'yyyy-MM-dd'
  );
  return [start, end];
}

function getCalcDay(date = new Date(), days: number) {
  const next = new Date(date.getTime());
  next.setDate(date.getDate() + days);

  return format(next, 'yyyy-MM-dd');
}

export function addWeekToRange(dateRange: string[], weeks: number) {
  const start = getCalcDay(new Date(dateRange[0]), weeks * 7);
  const end = getCalcDay(new Date(dateRange[1]), weeks * 7);
  return [start, end];
}
