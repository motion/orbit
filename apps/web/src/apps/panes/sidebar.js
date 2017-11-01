import * as React from 'react'
import { view, store } from '@mcro/black'
import Fade from '~/views/fade'
import * as Sidebars from './sidebars'
import getItem from './helpers/getItem'
import PaneView from './pane'

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
      this.props.stackItem.setStore(this.childStore)
      // hacky for now
      window.sidebarStore = this.childStore
    }
  },
})
class SidebarContainer {
  componentDidMount() {
    this.props.sidebar.setStore(this.props.sidebarStore)
  }
  render({ paneProps, stackItem, ...props }) {
    return (
      <PaneView
        {...paneProps}
        sidebar
        getItem={getItem(paneProps.getActiveIndex)}
        stackItem={stackItem}
        {...props}
      />
    )
  }
}

@view
export default class Sidebar {
  static defaultProps = {
    width: 280,
    sidebars: Sidebars,
    itemProps: {
      size: 1.14,
      glow: true,
      padding: [10, 12],
      iconAfter: true,
    },
  }

  previousIndex = -1

  render({ width, itemProps, sidebars, store, store: { stack }, ...props }) {
    const currentIndex = stack.length - 1
    const { previousIndex } = this
    this.previousIndex = currentIndex
    return (
      <sidebar css={{ width, maxWidth: width, flex: 1 }}>
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
                data={stackItem.result.data}
                result={stackItem.result}
                onBack={store.stack.pop}
                sidebarStore={Sidebar}
                paneProps={{
                  index,
                  width,
                  getActiveIndex: () =>
                    stackItem.col === 0 && stackItem.firstIndex,
                  groupKey: 'category',
                  stack: store.stack,
                  sidebar: true,
                  onSelect: stackItem.onSelect,
                  itemProps,
                }}
                {...props}
              />
            </Fade>
          )
        })}
      </sidebar>
    )
  }
}
