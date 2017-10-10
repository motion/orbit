// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import SidebarMainStore from './sidebarMainStore'
import getItem from './getItem'

@view.attach('homeStore')
@view({
  sidebarMainStore: SidebarMainStore,
})
export default class SidebarMainColumn {
  render({ sidebarMainStore, paneProps }) {
    return (
      <Pane.Card
        items={sidebarMainStore.results}
        getItem={getItem(paneProps.getActiveIndex)}
        {...paneProps}
      />
    )
  }
}
