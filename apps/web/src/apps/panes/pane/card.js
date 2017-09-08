import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Actions from './actions'

@view.attach('paneStore')
@view
export default class PaneCard {
  setActions = () => {
    const { paneStore, actions, isActive } = this.props
    if (actions && isActive) paneStore.setActions(actions)
  }

  componentWillMount() {
    this.setActions()
  }
  componentWillUpdate() {
    this.setActions()
  }

  render({ paneStore, children, style, isActive, getRef, ...props }) {
    if (!paneStore) {
      return <h5>Provide paneStore to Pane.Card</h5>
    }

    const { actions, width } = this.props
    const { selectedIds, toolbarActions } = paneStore

    return (
      <card style={{ width, ...style }} {...props}>
        <UI.Theme name="light">
          <inner>
            <Actions actions={actions} if={actions} />
          </inner>
        </UI.Theme>
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
