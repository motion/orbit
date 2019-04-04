import React from 'react'
import { DateRangePicker } from 'react-date-range'
import { isBrowser } from './constants'
import { memoIsEqualDeep } from './helpers/memoHelpers'

if (isBrowser) {
  require('../Calendar.css')
}

export const Calendar = memoIsEqualDeep(function Calendar(props) {
  return <DateRangePicker {...props} />
})
