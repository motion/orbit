import { Contents } from 'gloss'
import React from 'react'
import { DateRangePicker } from 'react-date-range'

import { isBrowser } from './constants'
import { memoIsEqualDeep } from './helpers/memoHelpers'

if (isBrowser) {
  require('./Calendar.css')
  require('./CalendarThemeLight.css')
}

export const Calendar = memoIsEqualDeep(props => {
  return (
    <Contents className="calendar-dom">
      <DateRangePicker ranges={[]} {...props} />
    </Contents>
  )
})
