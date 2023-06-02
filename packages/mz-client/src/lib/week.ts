import { format } from 'date-fns';

export function getWeekRangeFromDate(d: Date) {
  // const day = d.getDay(); // 일 ~ 토 (0 ~ 6)
  // const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 날짜 - 요일 + 1 ?
  // const start = format(new Date(d.setDate(diff)), 'yyyy-MM-dd');
  // const end = format(new Date(d.setDate(diff + 6)), 'yyyy-MM-dd');
  // return [start, end];

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
