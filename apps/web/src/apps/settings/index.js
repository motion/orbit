import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Integrations from './integrations'
import Setup from './setup'

@view({
  store: class SettingsStore {
    activeItem = null
  },
})
export default class SettingsPage {
  render({ store }) {
    const itemProps = {
      size: 1.1,
    }

    return (
      <UI.Theme name="light">
        <settings>
          <header>
            <UI.Title size={2}>Settings</UI.Title>
          </header>

          <content>
            <sidebar>
              <Integrations
                onSelect={store.ref('activeItem').set}
                itemProps={itemProps}
                settingsStore={store}
              />
            </sidebar>
            <main>
              <Setup
                if={store.activeItem}
                item={store.activeItem}
                key={Math.random()}
              />
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
