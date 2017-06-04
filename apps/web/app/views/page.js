import React from 'react'
import { $, view, observable } from '~/helpers'
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
      flex: 1,
      // overflowY: 'scroll',
      // overflowX: 'visible',
      overflow: 'visible',
      position: 'relative',
    },
  }
}
