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
    this.props.paneStore.selectRow(index)
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
  }) {
    const getItemDefault = (item, index) => ({
      highlight: () => index === paneStore.activeIndex,
      children: item.view,
    })

    return (
      <card
        style={{ width, ...style }}
        css={{
          transition: 'all ease-in 80ms',
          zIndex: 1000,
          //transform: { y: paneStore.col === 1 && paneStore.isActive ? -5 : 0 },
        }}
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

        <UI.Drawer
          if={false}
          from="bottom"
          open={paneStore.showAction}
          onClickOverlay={paneStore.ref('showAction').toggle}
          showOverlay
          overlayBlur
          css={{ right: 6, left: 6 }}
        >
          <UI.Theme name="light">
            <UI.Surface background="#fff" flex padding={20} borderTopRadius={6}>
              <UI.Title>Have a nice day</UI.Title>
            </UI.Surface>
          </UI.Theme>
        </UI.Drawer>
      </card>
    )
  }

  static style = {
    card: {
      flex: 1,
      position: 'relative',
      overflowY: 'scroll',
      transition: 'width 300ms ease-in',
    },
    content: {
      overflowY: 'scroll',
      height: '100%',
    },
  }
}
