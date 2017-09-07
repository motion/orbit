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
  render({ children, ...props }: Props) {
    if (children) {
      const date = new Date(children)
      const dateWords = ago(date)
      if (dateWords.indexOf('NaN') === 0) {
        return null
      }
      return <Text {...props}>{dateWords}</Text>
    }
    return null
  }
}
