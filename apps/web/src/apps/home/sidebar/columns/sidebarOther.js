// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Pane from '~/apps/pane'
import SidebarMainStore from './sidebarMainStore'
import getItem from './getItem'

@view.attach('homeStore')
@view({
  sidebarMainStore: SidebarMainStore,
})
export default class SidebarMainColumn {
  componentDidMount() {
    this.props.setStore(this.props.sidebarMainStore)
  }

  render({ sidebarMainStore, paneProps }) {
    return (
      <Pane
        items={sidebarMainStore.results}
        getItem={getItem(paneProps.getActiveIndex)}
        {...paneProps}
      />
    )
  }
}
