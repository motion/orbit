import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Thing, CurrentUser } from '~/app'
import { fuzzy } from '~/helpers'

@view({
  store: class ContentPaneStore {
    search = ''
    allThings = Thing.find()

    get things() {
      return fuzzy(this.allThings || [], this.search, {
        keys: ['title'],
      })
    }

    get setting() {
      return CurrentUser.setting.pins
    }
  },
})
export default class ContentPane {
  render({ store }) {
    if (!store.setting) {
      console.log('no setting')
      return null
    }
    return (
      <pane>
        <content>
          <UI.Input
            marginBottom={10}
            size={1.2}
            placeholder="Filter..."
            onChange={e => (store.search = e.target.value)}
            value={store.search}
          />
          <section $$flex>
            <UI.Title if={!store.things || !store.things.length} size={1.5}>
              Nothing pinned yet!
            </UI.Title>
            <UI.List
              virtualized
              itemProps={{
                borderBottom: [1, [0, 0, 0, 0.05]],
                padding: [15, 10],
                primaryProps: {
                  fontWeight: 600,
                  size: 1.2,
                  ellipse: true,
                },
              }}
              if={store.things}
              items={store.things}
              getItem={this.getItem}
            />
          </section>
        </content>
      </pane>
    )
  }

  getItem = thing => ({
    primary: thing.title,
    secondary: thing.url,
    content: thing.body,
    after: <UI.Button onClick={() => thing.remove()}>Delete</UI.Button>,
  })

  static style = {
    pane: {
      padding: 10,
      flex: 1,
    },
    content: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}
