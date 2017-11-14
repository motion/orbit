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
    items = null
    nextStack = null
    version = 0

    get stack() {
      return this.nextStack || this.props.store.stack
    }

    get stackItems() {
      if (this.nextStack) {
        const toLoad = this.nextStack.last
        return [...this.items, toLoad]
      }
      return this.items
    }

    get isLoadingNext() {
      return !!this.nextStack
    }

    willMount() {
      this.items = [...this.props.store.stack.items]

      // watch for update/load
      this.watch(() => {
        const { stack } = this.props.store
        if (!stack) {
          return
        }
        if (this.version !== stack.version) {
          if (!this.nextStack) {
            this.nextStack = stack
          }
        }
      })

      this.watch(() => {
        const { stack } = this.props.store
        if (this.version === stack.version) {
          return
        }
        if (
          this.nextStack &&
          this.nextStack.last.results &&
          this.nextStack.last.results.length > 1
        ) {
          this.onLoadedNext()
        }
      })
    }

    onLoadedNext = () => {
      this.items = [...this.nextStack.items]
      this.version = this.props.store.stack.version
      this.nextStack = null
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
    const { stackItems, isLoadingNext } = cacheStore
    if (!stackItems) {
      return null
    }
    console.log('stackItems', stackItems)
    const currentIndex = stackItems.length - (isLoadingNext ? 2 : 1)
    // log(isLoadingNext, 'index', currentIndex, 'length', stackItems.length)
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
          const key = stackItem.result.id || stackItem.result.title || index
          return (
            <Fade
              key={key}
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
                  stack,
                  width,
                  getActiveIndex: () =>
                    stackItem.col === 0 && stackItem.firstIndex,
                  groupBy: 'category',
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
