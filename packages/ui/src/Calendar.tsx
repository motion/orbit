import React from 'react'
import { DateRangePicker } from 'react-date-range'
import { memoIsEqualDeep } from './helpers/memoHelpers'

if (typeof window !== 'undefined') {
  require('../Calendar.css')
}

export const Calendar = memoIsEqualDeep(function Calendar(props) {
  return <DateRangePicker {...props} />
})
