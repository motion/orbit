import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view.attach('paneStore')
@view
export default class Actions {
  componentWillMount() {
    const { paneStore, actions } = this.props
    this.id = paneStore.addActions(actions)
  }

  componentWillUnmount() {
    const { paneStore } = this.props
    paneStore.removeActions(this.id)
  }

  render({ paneStore, actions, color }) {
    const { metaKey } = paneStore
    const shortcutButton = text => {
      const letter = text[0]
      return (
        <UI.Button key={text} chromeless color={color}>
          <div if={metaKey} $$row>
            ⌘<letter>{letter}</letter>
            {text.substr(1)}
          </div>
          <div if={!metaKey} $$row>
            {text}
          </div>
        </UI.Button>
      )
    }

    return (
      <actions $$row>
        {(actions || []).map(action => shortcutButton(action))}
      </actions>
    )
  }

  static style = {
    letter: {
      fontWeight: 600,
    },
  }
}
