// @flow
import React from 'react'
import { view, observable } from '@jot/black'
import { pick } from 'lodash'
import { SlotFill } from '~/ui'

@view
export default class Page {
  render({ children, sidebar, actions, loading, className }) {
    return (
      <page className={className}>
        <SlotFill.Fill if={actions} name="actions">{actions}</SlotFill.Fill>
        <SlotFill.Fill if={sidebar} name="sidebar">{sidebar}</SlotFill.Fill>
        {children}
      </page>
    )
  }

  static style = {
    page: {
      // dont play with overflow here or react-grid will clip
      flex: 1,
      overflow: 'visible',
      position: 'relative',
    },
  }
}
