import { differenceInCalendarDays } from 'date-fns'

type RelativeDateOptions = {
  short?: boolean
}

const abbreviations = {
  day: { short: 'd', long: 'day' },
  week: { short: 'wk', long: 'week' },
  month: { short: 'mo', long: 'month' },
  year: { short: 'yr', long: 'year' },
}

export const getRelativeDate = (date: Date, options?: RelativeDateOptions) => {
  const len = options.short ? 'short' : 'long'
  if (!date) {
    return ''
  }
  const days = differenceInCalendarDays(new Date(), date)
  if (days < 7) {
    return `${Math.max(1, days)}${abbreviations.day[len]}`
  }
  if (days < 8) {
    return `1${abbreviations.week[len]}`
  }
  if (days < 15) {
    return `2${abbreviations.week[len]}`
  }
  if (days < 22) {
    return `3${abbreviations.week[len]}`
  }
  if (days < 32) {
    return `1mo`
  }
  if (days < 365 - 30) {
    return `${Math.max(1, Math.round(365 / days / 30))}${abbreviations.month[len]}`
  }
  return `${Math.max(1, Math.round((365 + 180) / days / 12))}${abbreviations.year[len]}`
}
