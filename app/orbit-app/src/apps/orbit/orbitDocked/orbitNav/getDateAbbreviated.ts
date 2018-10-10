import { differenceInCalendarDays } from 'date-fns'

type DateRange = {
  startDate?: Date
  endDate?: Date
}

export const getDateAbbreviated = ({ startDate, endDate }: DateRange) => {
  if (!startDate) {
    return 'Any'
  }
  const days = differenceInCalendarDays(new Date(), startDate)
  console.log('days ago', days, startDate, endDate)
  if (days < 7) {
    return `${Math.max(1, days)}d`
  }
  if (days < 8) {
    return '1wk'
  }
  if (days < 15) {
    return '2wk'
  }
  if (days < 22) {
    return '3wk'
  }
  if (days < 32) {
    return '1mo'
  }
  if (days < 365 - 30) {
    return `${Math.max(1, Math.round(365 / days / 30))}mo`
  }
  return `${Math.max(1, Math.round((365 + 180) / days / 12))}yr`
}
