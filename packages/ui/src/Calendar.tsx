import React from 'react'
import { DateRangePicker } from 'react-date-range'

if (typeof window !== 'undefined') {
  require('../Calendar.css')
}

export function Calendar(props) {
  return <DateRangePicker {...props} />
}
