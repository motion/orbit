import { differenceInCalendarDays, differenceInCalendarYears } from 'date-fns/esm/fp'
import * as React from 'react'
import { TimeAgo } from './TimeAgo'

const defaultOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
}

export function DateFormat({ date = new Date(), locale = 'en-US', options = null, nice = false }) {
  if (nice) {
    return <TimeAgo>{date}</TimeAgo>
  }
  let finalOptions = {
    ...defaultOptions,
    ...options,
  }
  if (differenceInCalendarYears(date, Date.now()) > 0) {
    finalOptions.year = '2-digit'
    delete finalOptions.weekday
  } else if (differenceInCalendarDays(date, Date.now()) < 7) {
    finalOptions = {
      weekday: 'short',
    }
  }
  const formatted = date
    .toLocaleDateString(locale, finalOptions)
    .replace(/,.*,/, ',')
    .replace(/\//g, '·')

  // TODO wait for https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544 to fix type
  return formatted as any
}
