// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import SidebarMainStore from './sidebarMainStore'

@view({
  sidebarMainStore: SidebarMainStore,
})
export default class SidebarMain {
  render({ sidebarMainStore, sidebarCardProps }) {
    return (
      <Pane.Card
        primary
        items={sidebarMainStore.results}
        {...sidebarCardProps}
      />
    )
  }
}
