import * as React from 'react'
import { view, store } from '@mcro/black'
import Fade from '~/views/fade'
import * as Sidebars from './sidebars'
import PaneView from './pane'
import { ORA_WIDTH } from '~/constants'
import getItem from './helpers/getItem'
import { OS } from '~/helpers'

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
  render(props) {
    return <PaneView {...props} />
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
      this.version = this.props.store.stack.version

      // watch for update/load
      this.watch(function watchStackLoad() {
        const { stack } = this.props.store
        if (!stack) {
          return
        }
        const isGoingBack = stack.items.length < this.items.length
        if (isGoingBack) {
          this.loadNext()
          return
        }
        if (this.version !== stack.version) {
          if (!this.nextStack) {
            this.nextStack = stack
          }
        }
      })

      this.watch(function watchFinishedLoading() {
        const { stack } = this.props.store
        if (this.version === stack.version) {
          return
        }
        if (
          this.nextStack &&
          this.nextStack.last.store &&
          this.nextStack.last.store.finishedLoading
        ) {
          this.loadNext()
        }
      })
    }

    loadNext = () => {
      this.items = [...this.stack.items]
      this.version = this.props.store.stack.version
      this.nextStack = null
    }
  },
})
export default class Sidebar {
  static defaultProps = {
    width: ORA_WIDTH,
  }

  render({ width, store, cacheStore, listProps, oraStore }) {
    const { stack } = store
    const { stackItems, isLoadingNext } = cacheStore
    if (!stackItems) {
      return null
    }
    const currentIndex = stackItems.length - (isLoadingNext ? 2 : 1)
    // if (isLoadingNext) {
    //   log('loadnext')
    //   log(isLoadingNext, currentIndex, `${stackItems.map(i => i.result.id)}`)
    // }
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
          const Sidebar = Sidebars[stackItem.result.type]
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
                oraStore={oraStore}
                isActive={index === currentIndex}
                width={width}
                stack={stack}
                stackItem={stackItem}
                navigate={stack.navigate}
                result={stackItem.result}
                sidebarStore={Sidebar}
                hasParent={!!stackItem.parent}
                listProps={{
                  getItem,
                  width,
                  highlight: i => i === stackItem.selectedIndex,
                  onSelect(item) {
                    console.log('clear peek')
                    OS.send('peek', null)
                    if (item.selectable === false) {
                      return false
                    }
                    if (item.onClick) {
                      return item.onClick()
                    }
                    stackItem.onSelect(item, index)
                  },
                  ...listProps,
                }}
              />
            </Fade>
          )
        })}
      </sidebar>
    )
  }
}
