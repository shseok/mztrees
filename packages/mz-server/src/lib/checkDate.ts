import AppError from './NextAppError.js'

export function checkWeekRange({ startDate, endDate }: DateParams) {
  const oneDat = 24 * 60 * 60 * 1000
  const diffInDays = Math.round(
    Math.abs(
      (new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDat,
    ),
  )

  if (diffInDays > 7) {
    throw new AppError('BadRequest', { message: 'Date range exceeds 7 days.' })
  }
}

export function checkDateFormat({ startDate, endDate }: DateParams) {
  if ([startDate, endDate].some((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
    throw new AppError('BadRequest', {
      message: 'startDate and endDate is not yyyy-mm-dd format',
    })
  }
}

interface DateParams {
  startDate: string
  endDate: string
}
