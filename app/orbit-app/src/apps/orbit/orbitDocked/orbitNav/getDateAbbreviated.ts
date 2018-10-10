import { differenceInCalendarDays } from 'date-fns'

type DateRange = {
  startDate?: Date
  endDate?: Date
}

export const getDateAbbreviated = ({ startDate, endDate }: DateRange) => {
  if (!startDate) {
    return 'Any'
  }
  const days = differenceInCalendarDays(new Date(), endDate)
  if (days < 7) {
    return `${Math.round(days / 7)}d`
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
    return `${Math.round(365 / days)}mo`
  }
  return `${Math.round((365 + 180) / days)}yr`
}
