import * as React from 'react'
import { TimeAgo } from './TimeAgo'
import { differenceInCalendarYears } from 'date-fns/esm/fp'

const defaultOptions = {
  weekday: 'short',
  month: 'long',
  day: 'numeric',
}

export const DateFormat = ({
  date = new Date(),
  locale = 'en-US',
  options = null,
  nice = false,
}) => {
  if (nice) {
    return <TimeAgo>{date}</TimeAgo>
  }
  let finalOptions = options || defaultOptions
  if (differenceInCalendarYears(Date.now(), date) > 0) {
    finalOptions.year = 'numeric'
  }
  return <>{`${date.toLocaleDateString(locale, finalOptions)}`}</>
}
