import * as React from 'react'
import { view, store } from '@mcro/black'
import Fade from '~/views/fade'
import * as Sidebars from './sidebars'
import getItem from './helpers/getItem'
import PaneView from './pane'
import { ORA_WIDTH } from '~/constants'

@view({
  sidebar: class SidebarStore {
    childStore = null
    get results() {
      return this.childStore.results
    }
    setStore(childStore) {
      if (childStore.prototype) {
        Object.defineProperty(childStore.prototype, 'props', {
          get: () => this.props,
          configurable: true,
        })
        this.childStore = new store(childStore)()
        this.props.stackItem.setStore(this.childStore)
        // hacky for now
        window.sidebarStore = this.childStore
      }
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

@view({
  // cache store handles preloading the next result
  // and then showing it after its done
  // this is so we can animate after results are there
  // and prevents lots of flickering as you move around
  cacheStore: class SidebarCacheStore {
    nextItems = null
    items = this.props.store.stack.items
    version = 0

    get stackItems() {
      return this.nextItems || this.items
    }

    get showingNext() {
      return !!this.nextItems
    }

    willMount() {
      // watch for update
      this.watch(() => {
        const { stack } = this.props.store
        // log('checking out for shit yea', this.version, stack.version)
        if (stack && this.version !== stack.version) {
          this.nextItems = stack.items
          // log('next id:', stack.last.result.id)
        }
      })
      // watch for load
      this.watch(() => {
        const { stack } = this.props.store
        if (this.nextItems && stack.last.results && stack.last.results.length) {
          // log('LOADED NEXT', stack.last.result.id)
          this.onLoadedNext()
        }
      })
    }

    onLoadedNext() {
      this.version = this.props.store.stack.version
      this.items = this.nextItems
      this.nextItems = null
    }
  },
})
export default class Sidebar {
  static defaultProps = {
    width: ORA_WIDTH,
    sidebars: Sidebars,
    itemProps: {
      size: 1.14,
      glow: true,
      padding: [10, 12],
      iconAfter: true,
      childrenEllipse: 3,
    },
  }

  render({ width, itemProps, sidebars, store, cacheStore, ...props }) {
    const { stack } = store
    const { stackItems, showingNext } = cacheStore
    const currentIndex = stackItems.length - (showingNext ? 2 : 1)
    // log('render', showingNext, currentIndex)
    return (
      <sidebar css={{ width, maxWidth: width, flex: 1 }}>
        {stackItems.map((stackItem, index) => {
          // only show last three
          if (index + 2 < currentIndex) {
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
              key={stackItem.result.title}
              width={width}
              index={index}
              currentIndex={currentIndex}
            >
              <SidebarContainer
                stackItem={stackItem}
                navigate={stack.navigate}
                data={stackItem.result.data}
                result={stackItem.result}
                onBack={stack.pop}
                sidebarStore={Sidebar}
                paneProps={{
                  index,
                  width,
                  getActiveIndex: () =>
                    stackItem.col === 0 && stackItem.firstIndex,
                  groupBy: 'category',
                  stack: stack,
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
