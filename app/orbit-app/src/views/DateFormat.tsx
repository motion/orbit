import { differenceInCalendarDays } from 'date-fns/esm'
import { TimeAgo } from './TimeAgo'

const defaultOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export const DateFormat = ({
  date = new Date(),
  locale = 'en-US',
  options = defaultOptions,
  nice = false,
}) => {
  if (nice && differenceInCalendarDays(Date.now(), date) < 7) {
    return <TimeAgo>{date}</TimeAgo>
  }
  return `${date.toLocaleDateString(locale, options)}`
}
