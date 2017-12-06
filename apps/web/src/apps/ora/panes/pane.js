import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import SidebarTitle from '~/views/sidebarTitle'
import Drawer from '~/views/drawer'
import { debounce } from 'lodash'

class PaneStore {
  listRef = null
  contentRef = null
  contentVersion = 0

  willMount() {
    const { stackItem } = this.props
    this.watch(function watchPaneStackVersion() {
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

    let willScrollTo = null
    this.react(
      () => [
        sidebar
          ? stack.last.sidebarSelectedIndex
          : stack.last.mainSelectedIndex,
        this.props.oraStore.ui.search,
        this.props.oraStore.ui.barFocused,
        this.contentVersion,
      ],
      ([index]) => {
        if (!this.props.isActive) {
          return
        }
        clearTimeout(willScrollTo)
        willScrollTo = this.setTimeout(() => {
          this.listRef.scrollToRow(index)
        }, 150)
      },
      true
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
    if (store && store.drawer && store.drawer.handleClose) {
      store.drawer.handleClose()
    }
  }

  render({
    listProps,
    paneStore,
    children,
    style,
    width,
    sidebar,
    stackItem,
    disableGlow,
    transparent,
  }) {
    const list = paneStore.items && (
      <UI.List
        key={stackItem && stackItem.id}
        itemsKey={paneStore.contentVersion}
        getRef={paneStore.setList}
        onSelect={this.onSelect}
        items={paneStore.items}
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
    const title = (store && store.title) || (result && result.title)

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
          open={!!drawer}
          closable
          overlayBackground
          {...drawer}
        />
        <SidebarTitle
          if={title}
          title={title}
          subtitle={result.subtitle}
          noBack={!stackItem.parent}
          onBack={stackItem.stack.left}
          {...typeof title === 'object' && title}
        />
        <content $transparent={transparent} ref={paneStore.setContentRef}>
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
    },
    content: {
      // overflowY: 'scroll',
      flex: 1,
      position: 'relative',
      background: Constants.ORA_BG_MAIN,
    },
    transparent: {
      background: 'transparent',
    },
    bottomGlow: {
      boxShadow: [[0, 0, 80, 30, [...Constants.ORA_BG_MAIN_OPAQUE, 0.25]]],
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
