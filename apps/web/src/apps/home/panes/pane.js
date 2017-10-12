import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  paneStore: class PaneStore {
    listRef = null
    setList = ref => {
      if (!this.listRef) {
        this.listRef = ref

        const { sidebar, stack } = this.props

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
    }
  },
})
export default class Pane {
  onSelect = (item, index) => {
    if (item.onClick) {
      item.onClick()
    } else {
      this.props.onSelect(item, index)
    }
  }

  render({
    getItem,
    groupKey,
    listProps,
    virtualProps,
    itemProps,
    items,
    paneStore,
    getActiveIndex,
    children,
    style,
    width,
    theme,
    sidebar,
    actionBar,
  }) {
    const getItemDefault = (item, index) => ({
      highlight: () => index === getActiveIndex(),
      children: item,
    })

    return (
      <UI.Theme name={theme}>
        <card
          style={{ width, ...style }}
          $fullscreen={paneStore.fullscreen}
          $sidebar={sidebar}
        >
          <content if={!items}>{children}</content>
          <content if={items}>
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
          </content>
          <actions if={actionBar}>{actionBar}</actions>
        </card>
      </UI.Theme>
    )
  }

  static style = {
    card: {
      flex: 1,
      transition: 'all ease-in 80ms',
      zIndex: 1000,
      position: 'relative',
      overflowY: 'scroll',
    },
    sidebar: {
      marginTop: 5,
    },
    content: {
      overflowY: 'scroll',
      flex: 1,
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
