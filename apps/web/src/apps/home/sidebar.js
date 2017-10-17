import * as React from 'react'
import { view, ProvideStore } from '@mcro/black'
import Fade from './views/fade'
import * as Sidebars from './panes/sidebars'
import getItem from './panes/helpers/getItem'
import PaneView from './panes/pane'

// see stackStore for the "back" result item

const width = 250

const SidebarInner = ({ stackItem, store, paneProps, setStore }) => {
  window.sidebarStore = store // TODO: remove, TEMP
  setStore(store)
  return (
    <PaneView
      {...paneProps}
      store={store}
      getItem={getItem(paneProps.getActiveIndex)}
      items={stackItem.results}
    />
  )
}

const SidebarContainer = ({ sidebarStore, ...rest }) => {
  return (
    <ProvideStore store={sidebarStore} storeProps={rest}>
      {store => <SidebarInner store={store} {...rest} />}
    </ProvideStore>
  )
}

@view
export default class Sidebar {
  previousIndex = -1

  render({ homeStore, homeStore: { stack } }) {
    const currentIndex = stack.length - 1
    const { previousIndex } = this
    this.previousIndex = currentIndex
    return (
      <sidebar css={{ width }}>
        {stack.items.map((stackItem, index) => {
          // only show last two
          if (index + 1 < currentIndex) {
            return null
          }
          if (!stackItem.result) {
            return <null>bad result</null>
          }
          const Sidebar = Sidebars[stackItem.result.type]
          if (!Sidebar) {
            return <null>not found Sidebar {stackItem.result.type}</null>
          }
          return (
            <Fade
              key={index}
              width={width}
              index={index}
              currentIndex={currentIndex}
              previousIndex={previousIndex}
            >
              <SidebarContainer
                stackItem={stackItem}
                navigate={stack.navigate}
                setStore={stackItem.setStore}
                data={stackItem.result.data}
                result={stackItem.result}
                onBack={homeStore.stack.pop}
                homeStore={homeStore}
                sidebarStore={Sidebar}
                paneProps={{
                  index,
                  width,
                  getActiveIndex: () =>
                    stackItem.col === 0 && stackItem.firstIndex,
                  groupKey: 'category',
                  stack: homeStore.stack,
                  sidebar: true,
                  onSelect: stackItem.onSelect,
                  itemProps: {
                    size: 1.14,
                    glow: true,
                    padding: [10, 12],
                    iconAfter: true,
                  },
                }}
              />
            </Fade>
          )
        })}
      </sidebar>
    )
  }
}
