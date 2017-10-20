import * as React from 'react'
import { view } from '@mcro/black'
import * as Mains from './panes/mains'
import * as UI from '@mcro/ui'

const SHADOW = [0, 0, 120, [0, 0, 0, 0.05]]

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
      const Main = Mains[stackItem.sidebarSelected.type]
      if (!Main || typeof Main !== 'function') {
        console.log('Main = ', Main)
        return <null>not found {stackItem.sidebarSelected.type}</null>
      }
      const key = stackItem.selectedKey
      const result = (
        <pane key={key} $active={stackItem.col === 1}>
          <UI.Theme name="light">
            <Main
              key={key}
              stackItem={stackItem}
              navigate={stack.navigate}
              result={stackItem.sidebarSelected}
              data={stackItem.sidebarSelected.data}
              setMainStore={stackItem.setMainStore}
              paneProps={{
                index,
                //dark: true,
                stack: homeStore.stack,
                getActiveIndex: () => stackItem.firstIndex,
                stackItem,
              }}
            />
          </UI.Theme>
        </pane>
      )
      return result
    })
  }

  static style = {
    pane: {
      flex: 1,
      background: [255, 255, 255],
      borderRadius: 6,
      borderBottomRightRadius: 0,
      boxShadow: [SHADOW],
      transition: 'transform ease-in 130ms',
      zIndex: 1000,
      overflow: 'hidden',
    },
    active: {
      boxShadow: [SHADOW, [0, 0, 0, 3, [0, 0, 0, 0.3]]],
      // transform: {
      //   y: -3,
      // },
    },
  }
}
