// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Pane from '../pane'
import SidebarMainStore from './mainSidebarStore'
import { getItem } from '../helpers'

@view.attach('homeStore')
@view({
  sidebarMainStore: SidebarMainStore,
})
class MainSidebar {
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

export default {
  Sidebar: MainSidebar,
}
