import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Integrations from './integrations'
import Setup from './setup'

@view({
  store: class SettingsStore {
    activeItem = 0
  },
})
export default class SettingsPage {
  render({ store }) {
    const itemProps = {
      size: 1.2,
      glow: false,
      fontSize: 26,
      padding: [0, 10],
    }

    return (
      <UI.Theme name="light">
        <settings>
          <header>
            <UI.Title size={3}>Settings</UI.Title>
          </header>

          <content>
            <sidebar>
              <Integrations
                onSelect={store.ref('activeItem').set}
                itemProps={itemProps}
              />
            </sidebar>
            <main>
              <Setup if={store.activeItem} item={store.activeItem} />
            </main>
          </content>
        </settings>
      </UI.Theme>
    )
  }

  static style = {
    settings: {
      flex: 1,
    },
    header: {
      padding: [20, 20, 10],
      borderBottom: [1, '#eee'],
    },
    content: {
      flexFlow: 'row',
      flex: 1,
    },
    sidebar: {
      width: 200,
      height: '100%',
      borderRight: [1, '#eee'],
    },
    main: {
      flex: 1,
    },
  }
}
