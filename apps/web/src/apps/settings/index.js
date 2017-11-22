import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneView from '~/apps/panes/pane'
import * as CategoryPanes from './panes'

@view.provide({
  store: class SettingsStore {
    activeIndex = 0
    items = [
      { primary: 'Slack', type: 'slack', category: 'Integrations' },
      { primary: 'Github', type: 'github', category: 'Integrations' },
      { primary: 'Google Drive', type: 'drive', category: 'Integrations' },
      {
        primary: 'Google Calendar',
        type: 'calendar',
        category: 'Integrations',
      },
    ]
    get activeItem() {
      return this.items[this.activeIndex]
    }
    selectItem = (result, index) => {
      this.activeIndex = index
    }
  },
})
@view
export default class SettingsPage {
  render({ store }) {
    const category = store.activeItem.category.toLowerCase()
    const CategoryPane = CategoryPanes[category]
    if (!CategoryPane) {
      console.log('nada')
      return null
    }
    return (
      <UI.Theme name="clear-dark">
        <home $$fullscreen>
          <handle
            $$draggable
            css={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 40,
              zIndex: 100,
            }}
          />
          <sidebar $$draggable css={{ paddingTop: 36, width: 280 }}>
            <PaneView
              sidebar
              groupBy="category"
              onSelect={store.selectItem}
              items={store.items}
              getItem={(item, index) => ({
                ...item,
                highlight: () => index === store.activeIndex,
              })}
              itemProps={{
                size: 1.1,
                padding: [8, 12],
                glow: true,
                glowProps: {
                  color: '#fff',
                  scale: 1,
                  blur: 70,
                  opacity: 0.3,
                  show: false,
                  resist: 60,
                  zIndex: -1,
                },
                highlightBackground: [255, 255, 255, 0.1],
                childrenEllipse: 2,
              }}
            />
          </sidebar>
          <UI.Theme name="light">
            <content>
              <CategoryPane type={store.activeItem.type} />
            </content>
          </UI.Theme>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      background: [200, 200, 200, 0.45],
      flex: 1,
      flexFlow: 'row',
    },
    content: {
      flex: 1,
      background: '#fff',
      padding: 20,
    },
  }
}
