import { differenceInCalendarYears } from 'date-fns/esm/fp'
import * as React from 'react'
import { TimeAgo } from './TimeAgo'

const defaultOptions = {
  weekday: 'short',
  month: 'short',
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
  if (differenceInCalendarYears(date, Date.now()) > 1) {
    finalOptions.year = '2-digit'
  }
  return (
    <>
      {date
        .toLocaleDateString(locale, finalOptions)
        .replace(',', '')
        .replace(/\//g, '·')}
    </>
  )
}
