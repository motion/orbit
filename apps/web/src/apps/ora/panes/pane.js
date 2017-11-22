import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import SidebarTitle from '~/views/sidebarTitle'
import Drawer from '~/views/drawer'

class PaneStore {
  listRef = null
  contentRef = null
  contentVersion = 0

  willMount() {
    this.watchDrillIn()

    const { stackItem } = this.props
    this.watch(() => {
      if (stackItem && stackItem.results) {
        this.bumpVersion()
      }
    })
  }

  bumpVersion() {
    this.contentVersion++
  }

  get items() {
    if (this.props.items) {
      return this.props.items
    }
    if (this.props.stackItem) {
      return this.props.stackItem.results
    }
  }

  setContentRef(ref) {
    this.contentRef = ref
  }

  watchDrillIn = () => {
    if (this.props.sidebar) {
      return
    }
    this.react(
      () => this.props.stack && this.props.stack.last.col,
      col => {
        // focusing on main
        if (col === 1 && this.contentRef) {
          const list =
            this.contentRef.querySelector('.ReactVirtualized__List') ||
            this.contentRef.querySelector('.content')
          if (list) {
            list.focus()
          }
        }
      }
    )
  }

  setList = ref => {
    if (!this.listRef) {
      this.listRef = ref

      if (this.props.store && this.props.store.onListRef) {
        this.props.store.onListRef(this.listRef)
      }

      this.watchSelection()
    }
  }

  watchSelection = () => {
    const { sidebar, stack } = this.props
    if (!stack) {
      return
    }
    // scroll to row in list
    this.react(
      () => [
        sidebar
          ? stack.last.sidebarSelectedIndex
          : stack.last.mainSelectedIndex,
        this.props.oraStore.search,
      ],
      ([index]) => {
        // TODO fix flicker
        this.listRef.scrollToRow(index)
        this.setTimeout(() => this.listRef.scrollToRow(index))
      }
    )
  }
}

@view.attach('oraStore')
@view({
  paneStore: PaneStore,
})
export default class Pane {
  onSelect = (item, index) => {
    if (item.onClick) {
      item.onClick()
    } else if (this.props.onSelect) {
      this.props.onSelect(item, index)
    }
  }

  handleDrawerClose = () => {
    const { store } = this.props.stackItem
    if (store && store.onDrawerClose) {
      store.onDrawerClose()
    }
  }

  render({
    getItem,
    groupBy,
    listProps,
    itemProps,
    paneStore,
    getActiveIndex,
    children,
    style,
    width,
    sidebar,
    stackItem,
    hasParent,
    disableGlow,
  }) {
    const getItemDefault = (item, index) => ({
      highlight: () => (getActiveIndex ? index === getActiveIndex() : false),
      children: item,
    })

    const list = paneStore.items && (
      <UI.List
        itemsKey={paneStore.contentVersion}
        getRef={paneStore.setList}
        groupBy={groupBy}
        onSelect={this.onSelect}
        itemProps={{
          padding: 0,
          highlightBackground: [0, 0, 0, 0.08],
          highlightColor: [255, 255, 255, 1],
          ...itemProps,
        }}
        virtualized={{
          measure: true,
        }}
        items={paneStore.items}
        getItem={getItem || getItemDefault}
        {...listProps}
      />
    )

    let actions
    let drawer
    let store
    let result

    if (stackItem) {
      store = stackItem.store
      result = stackItem.result
      actions = store && store.actions
      drawer = store && store.drawer
    }

    const drawerHeight = 420
    console.log('pane render drawerheight', drawerHeight)

    return (
      <pane
        style={{ width, ...style }}
        $fullscreen={paneStore.fullscreen}
        $sidebar={sidebar}
        $actionBarPad={!!actions}
      >
        <Drawer
          if={store}
          size={drawerHeight}
          open={drawer}
          closable
          onClose={this.handleDrawerClose}
          title={store.drawerTitle}
        >
          {drawer}
        </Drawer>
        <SidebarTitle
          if={hasParent}
          title={(store && store.title) || result.title}
          subtitle={result.subtitle}
          onBack={stackItem.stack.left}
          image={
            this.props.oraStore.osContext &&
            this.props.oraStore.osContext.favicon
          }
          backProps={{
            icon: stackItem.stack.length > 2 ? 'arrow-min-left' : 'home',
          }}
        />
        <content ref={paneStore.setContentRef}>
          {!children
            ? list
            : typeof children === 'function' ? children(list) : children}
        </content>
        <bottomGlow
          if={!drawer && !disableGlow}
          $showWithActionBar={!!actions}
        />
      </pane>
    )
  }

  static style = {
    pane: {
      flex: 1,
      position: 'relative',
      overflow: 'scroll',
    },
    content: {
      overflowY: 'scroll',
      flex: 1,
      position: 'relative',
    },
    bottomGlow: {
      boxShadow: '0 0 80px 30px rgba(20,20,20,0.25)',
      zIndex: 100000 - 1,
      pointerEvents: 'none',
      position: 'fixed',
      bottom: 0,
      left: -120,
      right: -120,
    },
    showWithActionBar: {
      height: Constants.ACTION_BAR_HEIGHT,
    },
    fullscreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#fff',
      zIndex: 10000000,
    },
  }
}
