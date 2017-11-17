import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

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

  render({
    getItem,
    groupBy,
    listProps,
    virtualProps,
    itemProps,
    paneStore,
    getActiveIndex,
    children,
    style,
    width,
    sidebar,
    stackItem,
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
        virtualized={{
          measure: true,
          ...virtualProps,
        }}
        itemProps={{
          padding: 0,
          highlightBackground: [0, 0, 0, 0.08],
          highlightColor: [255, 255, 255, 1],
          ...itemProps,
        }}
        items={paneStore.items}
        getItem={getItem || getItemDefault}
        {...listProps}
      />
    )

    const { store } = stackItem
    const actions = store && store.actions
    const drawer = store && store.drawer

    return (
      <pane
        style={{ width, ...style }}
        $fullscreen={paneStore.fullscreen}
        $sidebar={sidebar}
        $actionBarPad={!!actions}
      >
        <UI.Drawer open={drawer} from="bottom" background="#000" size={400}>
          <drawerContents
            if={store}
            css={{
              padding: 10,
              flex: 1,
              overflowY: 'scroll',
            }}
          >
            <drawerTitle>
              <UI.Title
                if={store.drawerTitle}
                fontWeight={600}
                size={1.2}
                ellipse
              >
                {store.drawerTitle}
              </UI.Title>
              <UI.Button
                chromeless
                icon="remove"
                color="#fff"
                size={0.9}
                css={{ position: 'absolute', top: 10, right: 10 }}
                onClick={() => {
                  if (store.onDrawerClose) {
                    store.onDrawerClose()
                  }
                }}
              />
            </drawerTitle>
            {drawer}
          </drawerContents>
        </UI.Drawer>
        <content ref={paneStore.setContentRef}>
          {!children
            ? list
            : typeof children === 'function' ? children(list) : children}
        </content>
        <actions if={actions}>
          <actionbar>
            <UI.Row spaced itemProps={{ glow: true }}>
              {actions
                .filter(Boolean)
                .map(
                  ({ content, ...props }, index) =>
                    content ? (
                      <span key={index}>{content}</span>
                    ) : (
                      <UI.Button key={index} {...props} />
                    )
                )}
            </UI.Row>
          </actionbar>
        </actions>
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
    },
    drawerTitle: {
      background: [255, 255, 255, 0.05],
      borderBottom: [1, [255, 255, 255, 0.1]],
      margin: -10,
      padding: 10,
      flexFlow: 'row',
      position: 'relative',
      zIndex: 10,
    },
    // pads height of actionbar
    actionBarPad: {
      paddingBottom: 50,
    },
    actionbar: {
      padding: 10,
      borderTop: [1, [255, 255, 255, 0.15]],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: [0, 0, 0, 0.14],
      backdropFilter: 'blur(15px)',
      zIndex: 100000,
    },
    actionButton: {
      display: 'block',
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
