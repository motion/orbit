import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Setup from './setup'

@view({
  store: class SettingsStore {
    activeItem = 0

    items = [
      {
        title: 'Setup Github',
        data: { type: 'github', name: 'Github' },
        type: 'setup',
        icon: 'github',
      },
      {
        title: 'Setup Google',
        data: { type: 'google', name: 'Google' },
        type: 'setup',
        icon: 'google',
      },
      {
        title: 'Setup Slack',
        data: { type: 'slack', name: 'Slack' },
        type: 'setup',
        icon: 'slack',
      },
    ].map(x => ({
      ...x,
      category: 'Integrations',
    }))
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
              <UI.List
                if={store.items}
                defaultSelected={0}
                onSelect={(i, index) => (store.activeItem = index)}
                groupKey="category"
                items={store.items}
                itemProps={itemProps}
                getItem={(result, index) => ({
                  sizeHeight: true,
                  highlight: () => store.activeItem === index,
                  primary: result.title,
                  icon:
                    result.data && result.data.image ? (
                      <img $image src={`/images/${result.data.image}.jpg`} />
                    ) : (
                      result.icon || (result.doc && result.doc.icon)
                    ),
                })}
              />
            </sidebar>
            <main>
              <Setup item={store.items[store.activeItem]} />
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
