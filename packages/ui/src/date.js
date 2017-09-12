// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import timeago from 'time-ago'
import Text from './text'

const { ago } = timeago()

type Props = {
  children: string,
}

@view.ui
export default class DateView extends React.PureComponent<Props> {
  static format = text => {
    const date = new Date(text)
    const dateWords = ago(date)
    if (dateWords.indexOf('NaN') === 0) {
      return null
    }
    return dateWords
  }

  render({ children, ...props }: Props) {
    if (children) {
      return <Text {...props}>{this.constructor.format(children)}</Text>
    }
    return null
  }
}
