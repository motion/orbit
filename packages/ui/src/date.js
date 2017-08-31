// @flow
import React from 'react'
import { view } from '@mcro/black'
import timeago from 'time-ago'
import Text from './text'

const { ago } = timeago()

@view.ui
export default class Date {
  props: {
    children: string,
  }

  render({ children, ...props }) {
    return (
      <Text {...props}>
        {ago(children || '')}
      </Text>
    )
  }
}
