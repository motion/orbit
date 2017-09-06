import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view.attach('paneStore')
@view
export default class Actions {
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
      <UI.Theme name="light">
        <actions $$row>
          {(actions || []).map(action => shortcutButton(action))}
        </actions>
      </UI.Theme>
    )
  }

  static style = {
    letter: {
      fontWeight: 600,
    },
  }
}
