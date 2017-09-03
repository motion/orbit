// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import timeago from 'time-ago'
import Text from './text'

const { ago } = timeago()

type Props = {
  children: React$Element<any>,
}

@view.ui
export default class Date extends React.PureComponent<Props> {
  render({ children, ...props }) {
    return (
      <Text {...props}>
        {ago(children || '')}
      </Text>
    )
  }
}
