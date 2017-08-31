// @flow
import React from 'react'
import { view } from '@mcro/black'
import timeago from 'time-ago'

const { ago } = timeago()

@view.ui
export default class Date {
  props: {
    children: string,
  }

  render({ children, ...props }) {
    return (
      <date {...props}>
        {ago(children || '')}
      </date>
    )
  }
}
