import * as React from 'react'
import { view } from '@mcro/black'
import * as Mains from './panes/mains'

const SHADOW = [0, 2, 10, [0, 0, 0, 0.15]]

@view
export default class Main {
  cached = {}

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
      const Main = Mains[stackItem.sidebarSelected.type]
      if (!Main) {
        console.log('notfound', stackItem.sidebarSelected)
        return <null>not found {stackItem.sidebarSelected.type}</null>
      }
      const key = `${stackItem.selectedKey}${index}`
      if (this.cached[key]) {
        return this.cached[key]
      }
      const result = (
        <pane key={key} $active={stackItem.col === 1}>
          <Main
            key={key}
            stackItem={stackItem}
            navigate={stack.navigate}
            result={stackItem.sidebarSelected}
            data={stackItem.sidebarSelected.data}
            setMainStore={stackItem.setMainStore}
            paneProps={{
              index,
              light: true,
              stack: homeStore.stack,
              getActiveIndex: () => stackItem.firstIndex,
              stackItem,
            }}
          />
        </pane>
      )
      this.cached[key] = result
      return result
    })
  }

  static style = {
    pane: {
      flex: 1,
      background: '#fff',
      borderRadius: 6,
      borderBottomRightRadius: 0,
      boxShadow: [SHADOW],
      transition: 'all ease-in 80ms',
      zIndex: 1000,
      overflow: 'hidden',
    },
    active: {
      boxShadow: [SHADOW, [0, 0, 0, 3, [0, 0, 0, 0.3]]],
    },
  }
}
