import React from 'react'
import { $, view } from '~/helpers'
import { pick } from 'lodash'
import { SlotFill } from '~/ui'

@view class Loading {
  render() {
    return <spinner>loading</spinner>
  }
}

@view
export default class Page {
  render({ children, sidebar, extraActions, actions, loading, className }) {
    return (
      <page className={className}>
        <SlotFill.Fill if={extraActions} name="extraActions">
          {extraActions}
        </SlotFill.Fill>
        <SlotFill.Fill if={actions} name="actions">{actions}</SlotFill.Fill>
        <SlotFill.Fill if={sidebar} name="sidebar">{sidebar}</SlotFill.Fill>
        {children}
        <Loading if={loading} />
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      // overflowY: 'scroll',
      // overflowX: 'visible',
      overflow: 'visible',
    },
  }
}
