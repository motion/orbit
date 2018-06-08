import * as React from 'react'
import { view } from '@mcro/black'
import timeago from 'time-ago'

const { ago } = timeago()
export const format = text => {
  const date = new Date(text)
  const dateWords = ago(date)
  if (dateWords.indexOf('NaN') === 0) {
    console.log('got nan date', ago, text, date, dateWords)
    return 'nan'
  }
  return dateWords
}

@view.ui
export class Date extends React.PureComponent {
  static format = format

  render({ children }) {
    if (children) {
      return format(children)
    }
    return null
  }
}
