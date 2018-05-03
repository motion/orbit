import * as React from 'react'
import { view } from '@mcro/black'
import timeago from 'time-ago'

const { ago } = timeago()

@view.ui
export default class DateView extends React.PureComponent {
  static format = text => {
    const date = new Date(text)
    const dateWords = ago(date)
    if (dateWords.indexOf('NaN') === 0) {
      return null
    }
    return dateWords
  }

  render({ children }) {
    if (children) {
      return DateView.format(children)
    }
    return null
  }
}
