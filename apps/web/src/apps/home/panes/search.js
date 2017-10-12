import * as React from 'react'
import { view } from '@mcro/black'
import Pane from './pane'
import MainSidebarStore from './main/mainSidebarStore'

@view
class SearchMain extends React.Component<Props> {
  render({ paneProps }) {
    return (
      <Pane {...paneProps} light>
        results
      </Pane>
    )
  }
}

export default {
  Sidebar: MainSidebarStore,
  Main: SearchMain,
}
