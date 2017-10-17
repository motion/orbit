import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

// add types

@view({
  paneStore: class PaneStore {
    listRef = null
    contentRef = null

    willMount() {
      this.watchDrillIn()
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
      // turned off
      return false
      const { sidebar, stack } = this.props
      if (!stack) {
        return
      }
      // scroll to row in list
      this.react(
        () =>
          sidebar
            ? stack.last.sidebarSelectedIndex
            : stack.last.mainSelectedIndex,
        index => {
          this.listRef.scrollToRow(index)
        }
      )
    }
  },
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
    items: items_,
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

    let items

    if (store) {
      items = store.results
    } else {
      items = items_
    }

    if (light) {
      theme = 'light'
    }

    const list = items && (
      <UI.List
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
        items={items}
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
              <bar>
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
              </bar>
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
      overflow: 'scroll',
    },
    sidebar: {
      marginTop: 5,
    },
    content: {
      overflowY: 'scroll',
      flex: 1,
    },
    bar: {
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
