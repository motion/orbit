import * as React from 'react'
import { view, store } from '@mcro/black'
import Fade from './views/fade'
import * as Sidebars from '../panes/sidebars'
import getItem from '../panes/helpers/getItem'
import PaneView from '../panes/pane'

// see stackStore for the "back" result item

const width = 280

@view({
  sidebar: class SidebarStore {
    childStore = null
    get results() {
      return this.childStore.results
    }
    setStore(childStore) {
      Object.defineProperty(childStore.prototype, 'props', {
        get: () => this.props,
        configurable: true,
      })
      this.childStore = new store(childStore)()
      this.props.setStore(this.childStore)
    }
  },
})
class SidebarContainer {
  componentDidMount() {
    this.props.sidebar.setStore(this.props.sidebarStore)
  }
  render({ store, paneProps, stackItem }) {
    return (
      <PaneView
        {...paneProps}
        theme="dark"
        sidebar
        store={store}
        getItem={getItem(paneProps.getActiveIndex)}
        stackItem={stackItem}
      />
    )
  }
}

@view
export default class Sidebar {
  static defaultProps = {
    sidebars: Sidebars,
    itemProps: {
      size: 1.14,
      glow: true,
      padding: [10, 12],
      iconAfter: true,
    },
  }

  previousIndex = -1

  render({ itemProps, sidebars, homeStore, homeStore: { stack } }) {
    const currentIndex = stack.length - 1
    const { previousIndex } = this
    this.previousIndex = currentIndex
    return (
      <sidebar css={{ width, flex: 1 }}>
        {stack.items.map((stackItem, index) => {
          // only show last two
          if (index + 1 < currentIndex) {
            return null
          }
          if (!stackItem.result) {
            return <null>bad result</null>
          }
          const Sidebar = sidebars[stackItem.result.type]
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
                  itemProps,
                }}
              />
            </Fade>
          )
        })}
      </sidebar>
    )
  }
}
