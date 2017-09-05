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
export default class Date extends React.PureComponent<Props> {
  render({ children, ...props }: Props) {
    return <Text {...props}>{ago(children || '')}</Text>
  }
}
