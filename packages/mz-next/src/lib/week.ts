import { format } from 'date-fns';

export function getWeekRangeFromDate(d: Date) {
  const day = d.getDay();
  const startDate = d.getDate() - day;

  const start = format(new Date(d.setDate(startDate)), 'yyyy-MM-dd');
  let end = format(new Date(new Date(start).setDate(startDate + 6)), 'yyyy-MM-dd');

  if (+start.split('-')[2] > +end.split('-')[2]) {
    const endArr = end.split('-');
    endArr[1] = `${+endArr[1] + 1}`.length === 1 ? `0${+endArr[1] + 1}` : `${+endArr[1] + 1}`;
    end = endArr.join('-');
  }
  return [start, end];
}

export function getCalcDay(date = new Date(), days: number) {
  const next = new Date(date.getTime());
  next.setDate(date.getDate() + days);

  return format(next, 'yyyy-MM-dd');
}

export function addWeekToRange(dateRange: string[], weeks: number) {
  const start = getCalcDay(new Date(dateRange[0]), weeks * 7);
  const end = getCalcDay(new Date(dateRange[1]), weeks * 7);
  return [start, end];
}
