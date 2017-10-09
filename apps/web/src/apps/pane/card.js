import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view.attach('paneStore', 'millerStore')
@view
export default class PaneCard {
  setActions = ({ paneStore, millerStore, actions }) => {
    if (actions) {
      millerStore.setPaneActions(paneStore.props.index, actions)
    }
  }

  setResults = props => {
    if (props.items) {
      props.paneStore.setResults(() => props.items)
    }
  }

  componentWillMount() {
    this.setResults(this.props)
    this.setActions(this.props)
  }

  componentWillUpdate(nextProps) {
    this.setResults(nextProps)
    this.setActions(nextProps)
  }

  onSelect = (item, index) => {
    if (item.onClick) {
      item.onClick()
    } else {
      this.props.paneStore.selectRow(index)
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
    children,
    style,
    width,
    theme,
    primary,
  }) {
    const getItemDefault = (item, index) => ({
      highlight: () => index === paneStore.activeIndex,
      children: item,
    })

    return (
      <UI.Theme name={theme}>
        <card
          style={{ width, ...style }}
          $fullscreen={paneStore.fullscreen}
          $primary={primary}
          $secondary={!primary}
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
                ...paneStore.itemProps,
                ...itemProps,
              }}
              items={items}
              getItem={getItem || getItemDefault}
              {...listProps}
            />
          </content>
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
    primary: {
      marginTop: 5,
    },
    secondary: {
      // transform: {
      //   y: -5,
      // },
    },
    content: {
      overflowY: 'scroll',
      height: '100%',
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
