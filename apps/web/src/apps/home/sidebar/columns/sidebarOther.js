// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import SidebarMainStore from './sidebarMainStore'

@view({
  sidebarMainStore: SidebarMainStore,
})
export default class SidebarOtherColumn {
  render({ sidebarMainStore, paneProps }) {
    return <Pane.Card items={sidebarMainStore.results} {...paneProps} />
  }
}
