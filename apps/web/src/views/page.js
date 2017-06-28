// @flow
import React from 'react'
import { view } from '@mcro/black'
import { SlotFill } from '@mcro/ui'

type Props = {
  children?: React$Element<any>,
  sidebar?: React$Element<any>,
  actions?: React$Element<any>,
  className?: string,
}

@view
export default class Page {
  render({ children, sidebar, actions, className }: Props) {
    return (
      <page className={className}>
        <SlotFill.Fill if={actions} key={Math.random()} name="actions">
          {actions}
        </SlotFill.Fill>
        <SlotFill.Fill if={sidebar} key={Math.random()} name="sidebar">
          {sidebar}
        </SlotFill.Fill>
        {children}
      </page>
    )
  }

  static style = {
    page: {
      // dont play with overflow here or react-grid will clip
      flex: 1,
      // dont add padding so we can add bottom bars
      overflow: 'visible',
      position: 'relative',
    },
  }
}
