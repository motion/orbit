import * as React from 'react'
import { view } from '@mcro/black'
import StackNavigator from './views/stackNavigator'
import * as Panes from './panes'

@view
export default class Main {
  render({ homeStore }) {
    return (
      <StackNavigator stack={homeStore.stack}>
        {({ stackItem, index, currentIndex, navigate }) => {
          if (index !== currentIndex) {
            return null
          }
          const active = stackItem.data
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
              navigate={navigate}
              data={stackItem.sidebarSelected}
              paneProps={{
                index,
                stack: homeStore.stack,
                getActiveIndex: () => stackItem.firstIndex,
              }}
            />
          )
        }}
      </StackNavigator>
    )
  }
}
