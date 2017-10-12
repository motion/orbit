import * as React from 'react'
import { view } from '@mcro/black'
import * as Panes from './panes'

@view
export default class Main {
  render({ homeStore, homeStore: { stack } }) {
    const lastIndex = stack.length - 1
    return stack.items.map((stackItem, index) => {
      if (index !== lastIndex) {
        return null
      }
      const active = stackItem.result
      if (!active) {
        return <null>Nothing selected</null>
      }
      const Pane = Panes[stackItem.sidebarSelected.type]
      if (!Pane || !Pane.Main) {
        console.log('notfound', stackItem.sidebarSelected)
        return <null>not found {stackItem.sidebarSelected.type}</null>
      }
      return (
        <Pane.Main
          key={stackItem.selectedKey}
          stackItem={stackItem}
          navigate={stack.navigate}
          result={stackItem.sidebarSelected}
          data={stackItem.sidebarSelected.data}
          paneProps={{
            index,
            stack: homeStore.stack,
            getActiveIndex: () => stackItem.firstIndex,
          }}
        />
      )
    })
  }
}
