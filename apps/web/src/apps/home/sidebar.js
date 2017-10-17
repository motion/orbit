import * as React from 'react'
import { view, ProvideStore } from '@mcro/black'
import Fade from './views/fade'
import * as Sidebars from './panes/sidebars'
import { getItem } from './panes/helpers'
import PaneView from './panes/pane'

const width = 250

@view.attach('homeStore')
@view.ui
class SidebarContainer {
  render({ sidebarStore, paneProps, ...rest }) {
    return (
      <ProvideStore store={sidebarStore} storeProps={rest}>
        {store => {
          window.sidebarStore = store // TODO: remove, TEMP
          this.props.setStore(store)
          return (
            <PaneView
              store={store}
              getItem={getItem(paneProps.getActiveIndex)}
              {...paneProps}
            />
          )
        }}
      </ProvideStore>
    )
  }
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
                paneProps={{
                  index,
                  stack: homeStore.stack,
                  sidebar: true,
                  getActiveIndex: () =>
                    stackItem.col === 0 && stackItem.firstIndex,
                  onSelect: stackItem.onSelect,
                  itemProps: {
                    size: 1.14,
                    glow: true,
                    padding: [10, 12],
                    iconAfter: true,
                    //iconSize: 22,
                  },
                  width,
                  groupKey: 'category',
                }}
                sidebarStore={Sidebar}
              />
            </Fade>
          )
        })}
      </sidebar>
    )
  }
}
