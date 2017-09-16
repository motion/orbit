import { view } from '@mcro/black'

@view.attach('paneStore', 'millerStore')
@view
export default class PaneCard {
  setActions = () => {
    const { paneStore, millerStore, actions } = this.props
    if (actions) {
      millerStore.setPaneActions(paneStore.props.index, actions)
    }
  }

  componentWillMount() {
    this.setActions()
  }

  componentWillUpdate() {
    this.setActions()
  }

  render({ children, style, width }) {
    return (
      <card style={{ width, ...style }}>
        <content>{children}</content>
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
    light: {
      background: '#eee',
    },
    content: {
      overflow: 'scroll',
      height: '100%',
    },
    toolbar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      padding: [3, 20],
      background: '#333',
      color: '#eee',
      fontSize: 14,
    },
    icon: {
      marginLeft: 6,
    },
  }
}
