import React from 'react'
import { DateRangePicker } from 'react-date-range'
import { memoIsEqualDeep } from './helpers/memoHelpers'

const isNode = typeof process !== 'undefined' && process.release && process.release.name === 'node'

if (isNode === false) {
  require('../Calendar.css')
}

export const Calendar = memoIsEqualDeep(function Calendar(props) {
  return <DateRangePicker {...props} />
})
