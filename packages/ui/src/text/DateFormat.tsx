import { differenceInCalendarDays, differenceInCalendarYears } from 'date-fns'
import * as React from 'react'

import { TimeAgo } from './TimeAgo'

export type DateFormatProps = {
  /** Date object to format */
  date?: Date

  /** Defaults to en-US */
  locale?: string | string[]

  /** Switch to <TimeAgo /> for relative formating */
  nice?: boolean

  /** Date formatting options */
  options?: Intl.DateTimeFormatOptions
}

const defaultOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
}

export function DateFormat({
  date = new Date(),
  locale = 'en-US',
  options = null,
  nice = false,
}: DateFormatProps) {
  if (nice) {
    return <TimeAgo>{date}</TimeAgo>
  }
  let finalOptions: Intl.DateTimeFormatOptions = {
    ...defaultOptions,
    ...options,
  }
  if (differenceInCalendarYears(date, Date.now()) > 0) {
    finalOptions.year = '2-digit'
    delete finalOptions.weekday
  } else if (differenceInCalendarDays(date, Date.now()) < 7) {
    finalOptions.weekday = 'short'
  }
  let formatted
  if (date.toLocaleDateString) {
    formatted = date
      .toLocaleDateString(locale, finalOptions)
      .replace(/,.*,/, ',')
      .replace(/\//g, '·')
  } else {
    console.warn('invalid date', date)
    formatted = `${date}`
  }
  // TODO wait for https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544 to fix type
  return formatted as any
}
