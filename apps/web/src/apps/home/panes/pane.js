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
        this.props.homeStore.search,
      ],
      ([index]) => {
        // TODO fix flicker
        this.listRef.scrollToRow(index)
        this.setTimeout(() => this.listRef.scrollToRow(index))
      }
    )
  }
}

@view.attach('homeStore')
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
    groupKey,
    listProps,
    virtualProps,
    itemProps,
    store,
    paneStore,
    getActiveIndex,
    children,
    style,
    width,
    sidebar,
    actions,
    light,
    stackItem,
  }) {
    let { theme } = this.props

    const getItemDefault = (item, index) => ({
      highlight: () => (getActiveIndex ? index === getActiveIndex() : false),
      children: item,
    })

    if (light) {
      theme = 'light'
    }

    const list = paneStore.items && (
      <UI.List
        itemsKey={paneStore.contentVersion}
        getRef={paneStore.setList}
        groupKey={groupKey}
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

    return (
      <UI.Theme name={theme}>
        <pane
          style={{ width, ...style }}
          $fullscreen={paneStore.fullscreen}
          $sidebar={sidebar}
        >
          <content ref={paneStore.setContentRef}>
            {!children
              ? list
              : typeof children === 'function' ? children(list) : children}
          </content>
          <actions if={actions && stackItem && stackItem.col === 1}>
            <UI.Theme name="clear-light">
              <actionbar>
                <div $$flex={2} $$row>
                  <UI.Button
                    if={stackItem.result && stackItem.result.title}
                    chromeless
                    inline
                    opacity={0.5}
                    size={1.3}
                  >
                    {stackItem.result.title}
                  </UI.Button>
                </div>
                <UI.Row
                  spaced={10}
                  itemProps={{
                    size: 1.3,
                    inline: true,
                    chromeless: true,
                    glow: true,
                  }}
                >
                  {actions.map(
                    ({ title, content, ...props }, index) =>
                      content || (
                        <UI.Button $actionButton key={index} {...props}>
                          <actionButton>
                            <strong>{title.slice(0, 1).toUpperCase()}</strong>
                            {title.slice(1, Infinity)}
                          </actionButton>
                        </UI.Button>
                      )
                  )}
                </UI.Row>
              </actionbar>
            </UI.Theme>
          </actions>
        </pane>
      </UI.Theme>
    )
  }

  static style = {
    pane: {
      flex: 1,
      position: 'relative',
    },
    content: {
      overflowY: 'scroll',
      flex: 1,
    },
    actionbar: {
      padding: [10, 15],
      borderTop: [1, [0, 0, 0, 0.05]],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 250,
      right: 0,
      background: [255, 255, 255, 0.4],
      backdropFilter: 'blur(20px)',
      zIndex: Number.MAX_VALUE,
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
